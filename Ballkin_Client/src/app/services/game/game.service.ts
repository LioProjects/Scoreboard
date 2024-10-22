import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OneVsOneGameModeState } from '../../game-modes/one-vs-one-game-mode/one-vs-one-game-mode-state';
import { RoadToOneHundredGameModeState } from '../../game-modes/road-to-one-hundred-game-mode/road-to-one-hundred-game-mode-state';
import { GameModeState } from '../../interfaces/game-mode-state/game-mode-state';
import { MONEYBALLS, Moneyball } from '../../models/moneyball/moneyball.model';
import { PlayerGamePoint } from '../../models/player-game-point/player-game-point.model';
import { Player } from '../../models/player/player.model';
import { Statistic } from '../../models/statistic/statistic.model';
import { Game } from '../../models/game/game.model';
import { GameApiService } from '../api/game.api.service';
import { PlayerService } from '../player/player.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gameApiService: GameApiService;

  constructor() {
    this.gameApiService = new GameApiService();
  }
  private gameEnded: boolean = false;

  //List of all playerGamePoints in a Game
  private playerGamePointHistoryList = new BehaviorSubject<PlayerGamePoint[]>([]);
  //gamePoints$ = this.playerGamePointHistoryList.asObservable();

  //List of Game Snapshots (History of how Game evolved)
  private gameHistoryList: Game[] = [new Game()];


  private currentGameSubject = new BehaviorSubject<Game>(new Game());
  currentGame$ = this.currentGameSubject.asObservable();

  //List of selected Players that are playing in the current Game
  private selectedPlayersSubject = new BehaviorSubject<Player[]>([])
  selectedPlayers$ = this.selectedPlayersSubject.asObservable();

  private currentPlayerTurnSubject = new BehaviorSubject<Player | null>(null);
  currentPlayerTurn$ = this.currentPlayerTurnSubject.asObservable();

  private gameModeSubject = new BehaviorSubject<GameModeState>(new OneVsOneGameModeState(this));
  gameMode$ = this.gameModeSubject.asObservable();

  private moneyBallQueueSubject = new BehaviorSubject<Moneyball[]>(
    [
      {id: 1, multiplierForShooter: 1, multiplierForOpponent: 0},
      {id: 2, multiplierForShooter: 2, multiplierForOpponent: 0},
      {id: 3, multiplierForShooter: 3, multiplierForOpponent: -1},
      {id: 2, multiplierForShooter: 2, multiplierForOpponent: 0},
      {id: 3, multiplierForShooter: 3, multiplierForOpponent: -1},
      {id: 3, multiplierForShooter: 3, multiplierForOpponent: -1},
      {id: 2, multiplierForShooter: 2, multiplierForOpponent: 0},
    ]
  )
  moneyBallQueueSubject$ = this.moneyBallQueueSubject.asObservable();

  private moneyballEnabled: boolean = false;

  private GAMEMODES: GameModeState[] = [
    new OneVsOneGameModeState(this),
    new RoadToOneHundredGameModeState(this)
  ]

  setPlayer(playerList: Player[]){
    this.selectedPlayersSubject.next([...playerList]);
    if(playerList.length>0){
      this.currentPlayerTurnSubject.next(playerList[0]);
    }
  }

  setNextPlayerTurn() {
    const players = this.selectedPlayersSubject.getValue();
    const currentPlayer = this.currentPlayerTurnSubject.getValue();
  
    if (!players.length) {
      console.warn('No players available');
      return;
    }
  
    // Find the index of the current player
    const currentPlayerTurnIndex = players.findIndex(player => player === currentPlayer);
  
    // Calculate the next player index and update
    const nextPlayerTurnIndex = (currentPlayerTurnIndex + 1) % players.length;
    this.currentPlayerTurnSubject.next(players[nextPlayerTurnIndex]);
  }

  setGameStatus(isGameEnded: boolean){
    this.gameEnded = isGameEnded;
  }

  setGameMode(gameMode: GameModeState){
    this.gameModeSubject.next(gameMode);
  }

  addGamePoint(newGamePoint: PlayerGamePoint) {
    this.playerGamePointHistoryList.next([...this.playerGamePointHistoryList.value, newGamePoint]);
    this.calculateStatistics(newGamePoint);
  }
//= this.currentPlayerTurnSubject.getValue() als default value geben
//Todo: this shold be like api and public whereas all the internal functionalities should be private
  recordPlayerScore(player: Player , pointValue: number) {
  const moneyballInPlay = this.moneyballEnabled ? this.popMoneyball() : undefined;
  const newGamePoint = new PlayerGamePoint(player, pointValue, moneyballInPlay);
  this.gameModeSubject.getValue().recordPlayerScore(newGamePoint, this.currentGameSubject.getValue())
  }

  undo(){
    if (this.gameHistoryList.length === 1){
      return;
    }
    this.gameHistoryList.pop();
    this.currentGameSubject.next(this.gameHistoryList[this.gameHistoryList.length-1])
    let undonePlayerGamePoint = this.playerGamePointHistoryList.value[this.playerGamePointHistoryList.value.length-1];
    if (undonePlayerGamePoint?.moneyball){
      this.moneyBallQueueSubject.next([...this.moneyBallQueueSubject.getValue(), undonePlayerGamePoint.moneyball])
    }
    else if (undonePlayerGamePoint?.player){
      this.currentPlayerTurnSubject.next(undonePlayerGamePoint.player);
    }
    this.playerGamePointHistoryList.next([...this.playerGamePointHistoryList.value.slice(0, -1)])

  }

  saveGame(){
    if (this.currentGameSubject.getValue().playerStatistics.length === 0){
      return
    }
    this.gameApiService.createGame(this.currentGameSubject.getValue())
  }

  resetGame(){
    this.playerGamePointHistoryList.next([]);
    this.gameHistoryList = [];
    this.currentGameSubject.next(new Game());
    this.gameEnded = false;
  }

  private calculateStatistics(newGamePoint: PlayerGamePoint){
    const currentGame = this.currentGameSubject.getValue();
    let newGame = new Game([]);    
    if (!currentGame.playerStatistics.find(statistic => statistic.playerId === newGamePoint.player._id)){
      currentGame.playerStatistics.push(new Statistic(newGamePoint.player._id))
    }

    currentGame.playerStatistics.forEach((playerStatistic) => {
      let newPlayerNettoScore;
      let newPlayerBruttoScore;
      let newPlayerShotsTaken;
      let newPlayerPointValueScored;
      let newPlayerAdditiveScore;
      let newPlayerSufferedMalus;
      if (playerStatistic.playerId !== newGamePoint.player._id) {
          newPlayerNettoScore = playerStatistic.nettoScore + (newGamePoint.moneyball?.multiplierForOpponent ?? 0) * newGamePoint.pointValue * newGamePoint.multiplier;
          newPlayerAdditiveScore = [...playerStatistic.additiveScore]
          newPlayerAdditiveScore[playerStatistic.additiveScore.length-1] = newPlayerNettoScore;
          newPlayerSufferedMalus = playerStatistic.sufferedMalus + (newGamePoint.moneyball?.multiplierForOpponent ?? 0) * newGamePoint.pointValue;

      } else {
          newPlayerNettoScore = playerStatistic.nettoScore + (newGamePoint.moneyball?.multiplierForShooter ?? 1) * newGamePoint.pointValue * newGamePoint.multiplier;
          newPlayerBruttoScore = playerStatistic.bruttoScore + newGamePoint.pointValue;
          newPlayerShotsTaken = playerStatistic.shotsTaken + 1;
          newPlayerPointValueScored = [...playerStatistic.pointValueScored];
          newPlayerPointValueScored[newGamePoint.pointValue] += 1;
          newPlayerAdditiveScore = [...playerStatistic.additiveScore]
          newPlayerAdditiveScore.push(newPlayerNettoScore);
      }
      const newPlayerStatistic = new Statistic(
        playerStatistic.playerId,
        newPlayerNettoScore, 
        newPlayerBruttoScore ?? playerStatistic.bruttoScore, 
        newPlayerShotsTaken ?? playerStatistic.shotsTaken, 
        newPlayerPointValueScored ?? playerStatistic.pointValueScored,
        newPlayerAdditiveScore ?? playerStatistic.additiveScore,
        newPlayerSufferedMalus ?? playerStatistic.sufferedMalus
        )
        newGame.playerStatistics.push(newPlayerStatistic)
  });
  this.gameHistoryList.push(newGame);
  this.currentGameSubject.next(newGame);
  //Todo: why do i need this, if not points are registered for both players
  setTimeout(() => this.setNextPlayerTurn(), 0);
  }

  getMoneyballEnabled(){
    return this.moneyballEnabled;
  }

  toggleMoneyball() {
  this.moneyballEnabled = !this.moneyballEnabled;
}
  
  popMoneyball(): Moneyball {
      const randomMoneyballId = Math.floor(Math.random() * 3) + 1;
      const randomMoneyball = this.getMoneyballById(randomMoneyballId);
      if (!randomMoneyball) {
        throw Error("MoneyballId not found");
      }
      const moneyballQueueTemp = this.moneyBallQueueSubject.getValue();
      moneyballQueueTemp.unshift(randomMoneyball);
      const moneyballInPlay = moneyballQueueTemp.pop();
      this.moneyBallQueueSubject.next([...moneyballQueueTemp]);
      return moneyballInPlay as Moneyball;
    }

  private getMoneyballById(id: number): Moneyball | undefined {
    return MONEYBALLS.find(moneyball => moneyball.id === id);
  }

  getGameModes(): GameModeState[]{
    return this.GAMEMODES;
  }
}

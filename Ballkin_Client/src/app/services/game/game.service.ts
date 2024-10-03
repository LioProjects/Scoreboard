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

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private gameApiService: GameApiService;

  constructor() {
    this.gameApiService = new GameApiService(); // Create an instance of GameService
  }
  private gameEnded: boolean = false;

  private gamePointsSubject = new BehaviorSubject<PlayerGamePoint[]>([]);
  gamePoints$ = this.gamePointsSubject.asObservable();

  private statisticsHistory: Game[] = [new Game()];

  //observable currentstatistic
  private currentStatisticSubject = new BehaviorSubject<Game>(new Game());
  currentStatistic$ = this.currentStatisticSubject.asObservable();

  //Player Observables
  private playerOneSubject = new BehaviorSubject<Player | null>(null);
  playerOne$ = this.playerOneSubject.asObservable();

  private playerTwoSubject = new BehaviorSubject<Player | null>(null);
  playerTwo$ = this.playerTwoSubject.asObservable();

  private gameModeSubject = new BehaviorSubject<GameModeState>(new OneVsOneGameModeState(this));
  gameMode$ = this.gameModeSubject.asObservable();

  private moneyBallQueueSubject = new BehaviorSubject<Moneyball[]>(
    [
      {id: 1, multiplierForShooter: 1, multiplierForOpponent: 0},
      {id: 2, multiplierForShooter: 2, multiplierForOpponent: 0},
      {id: 3, multiplierForShooter: 3, multiplierForOpponent: -1},
      {id: 2, multiplierForShooter: 2, multiplierForOpponent: 0},
      {id: 3, multiplierForShooter: 3, multiplierForOpponent: -1},
    ]
  )
  moneyBallQueueSubject$ = this.moneyBallQueueSubject.asObservable();

  private moneyballEnabled: boolean = false;

  private GAMEMODES: GameModeState[] = [
    new OneVsOneGameModeState(this),
    new RoadToOneHundredGameModeState(this)
  ]

  setPlayerOne(player: Player){
    this.playerOneSubject.next(player);
  }

  setPlayerTwo(player: Player){
    this.playerTwoSubject.next(player);
  }

  setGameStatus(isGameEnded: boolean){
    this.gameEnded = isGameEnded;
  }

  setGameMode(gameMode: GameModeState){
    this.gameModeSubject.next(gameMode);
    console.log("gamemode changed to ", gameMode.getName())
  }

  addGamePoint(newGamePoint: PlayerGamePoint) {
    this.gamePointsSubject.next([...this.gamePointsSubject.value, newGamePoint]);
    this.calculateStatistics(newGamePoint);
  }

  recordPlayerScore(player: Player, pointValue: number) {
  const moneyballInPlay = this.moneyballEnabled ? this.popMoneyball() : undefined;
  const newGamePoint = new PlayerGamePoint(player, pointValue, moneyballInPlay);
  this.gameModeSubject.getValue().recordPlayerScore(newGamePoint, this.currentStatisticSubject.getValue())
  }

  undo(){
    if (this.statisticsHistory.length === 1){
      return;
    }
    this.statisticsHistory.pop();
    this.currentStatisticSubject.next(this.statisticsHistory[this.statisticsHistory.length-1])
    let possibleUndoneMoneyball = this.gamePointsSubject.value[this.gamePointsSubject.value.length-1].moneyball;
    if (possibleUndoneMoneyball){
      this.moneyBallQueueSubject.next([...this.moneyBallQueueSubject.getValue(), possibleUndoneMoneyball])
    }
    this.gamePointsSubject.next([...this.gamePointsSubject.value.slice(0, -1)])

  }

  saveGame(){
    this.gameApiService.createGame(this.currentStatisticSubject.getValue())
  }

  resetGame(){
    this.gamePointsSubject.next([]);
    this.statisticsHistory = [];
    this.currentStatisticSubject.next(new Game());
    this.gameEnded = false;
  }

  calculateStatistics(newGamePoint: PlayerGamePoint){
    const currentStatistic = this.currentStatisticSubject.getValue();
    let newStatistic = new Game([]);
    
    if (!currentStatistic.playerStatistics.find(statistic => statistic.playerId === newGamePoint.player._id)){
      currentStatistic.playerStatistics.push(new Statistic(newGamePoint.player._id))
    }

    currentStatistic.playerStatistics.forEach((playerStatistic) => {
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
          newPlayerPointValueScored = playerStatistic.pointValueScored;
          const pointValueScoredUpdate = (newPlayerPointValueScored.get(newGamePoint.pointValue)?? 0) + 1;
          newPlayerPointValueScored.set(newGamePoint.pointValue, pointValueScoredUpdate);
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
        newStatistic.playerStatistics.push(newPlayerStatistic)
  });
  this.statisticsHistory.push(newStatistic);
  this.currentStatisticSubject.next(newStatistic);
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

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OneVsOneGameModeState } from '../../game-modes/one-vs-one-game-mode/one-vs-one-game-mode-state';
import { GameModeState } from '../../interfaces/game-mode-state/game-mode-state';
import { MONEYBALLS, Moneyball } from '../../models/moneyball/moneyball.model';
import { PlayerGamePoint } from '../../models/player-game-point/player-game-point.model';
import { Player } from '../../models/player/player.model';
import { Statistic } from '../../models/statistic/statistic.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gamePointsSubject = new BehaviorSubject<PlayerGamePoint[]>([]);
  gamePoints$ = this.gamePointsSubject.asObservable();

  private statisticsHistory: Map<Player, Statistic>[] = [new Map()];

  //observable currentstatistic
  private currentStatisticSubject = new BehaviorSubject<Map<Player, Statistic>>(new Map());
  currentStatistic$ = this.currentStatisticSubject.asObservable();

  //Player Observables
  private playerOneSubject = new BehaviorSubject<Player | undefined>(undefined);
  playerOne$ = this.playerOneSubject.asObservable();

  private playerTwoSubject = new BehaviorSubject<Player | undefined>(undefined);
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


  setPlayerOne(player: Player){
    this.playerOneSubject.next(player);
  }

  setPlayerTwo(player: Player){
    this.playerTwoSubject.next(player);
  }

  private moneyballQueue: Moneyball[] = [
    {id: 1, multiplierForShooter: 1, multiplierForOpponent: 0},
    {id: 2, multiplierForShooter: 2, multiplierForOpponent: 0},
    {id: 3, multiplierForShooter: 3, multiplierForOpponent: -1},
  ]

  //todo: link this to the button in scoreboard
  private moneyballEnabled: boolean = false;

  addGamePoint(newGamePoint: PlayerGamePoint) {
    this.gamePointsSubject.next([...this.gamePointsSubject.value, newGamePoint]);
    this.calculateStatistics(newGamePoint);
  }

  recordPlayerScore(player: Player, pointValue: number) {
  const moneyballInPlay = this.moneyballEnabled ? this.popMoneyball() : undefined;
  const newGamePoint = new PlayerGamePoint(player, pointValue, moneyballInPlay);
  //this.gameModeSubject.value.recordPlayerScore(newGamePoint)
  this.addGamePoint(newGamePoint)
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

  resetGame(){
    this.gamePointsSubject.next([]);
    this.statisticsHistory = [new Map()]
    this.currentStatisticSubject.next(new Map())
  }

  calculateStatistics(newGamePoint: PlayerGamePoint){
    const currentStatistic = this.currentStatisticSubject.getValue();
    let newStatistic = new Map<Player, Statistic>();
    
    if (!currentStatistic.has(newGamePoint.player)){
      currentStatistic.set(newGamePoint.player, new Statistic())
    }

    currentStatistic.forEach((playerStatistic, player) => {
      let newPlayerNettoScore;
      let newPlayerBruttoScore;
      let newPlayerShotsTaken;
      let newPlayerPointValueScored;
      let newPlayerAdditiveScore;
      let newPlayerSufferedMalus;
      if (player !== newGamePoint.player) {
          newPlayerNettoScore = playerStatistic.nettoScore + (newGamePoint.moneyball?.multiplierForOpponent ?? 0) * newGamePoint.pointValue;
          newPlayerAdditiveScore = [...playerStatistic.additiveScore]
          newPlayerAdditiveScore[playerStatistic.additiveScore.length-1] = newPlayerNettoScore;
          newPlayerSufferedMalus = playerStatistic.sufferedMalus + (newGamePoint.moneyball?.multiplierForOpponent ?? 0) * newGamePoint.pointValue;

      } else {
          newPlayerNettoScore = playerStatistic.nettoScore + (newGamePoint.moneyball?.multiplierForShooter ?? 1) * newGamePoint.pointValue;
          newPlayerBruttoScore = playerStatistic.bruttoScore + newGamePoint.pointValue;
          newPlayerShotsTaken = playerStatistic.shotsTaken + 1;
          newPlayerPointValueScored = playerStatistic.pointValueScored;
          const pointValueScoredUpdate = (newPlayerPointValueScored.get(newGamePoint.pointValue)?? 0) + 1;
          newPlayerPointValueScored.set(newGamePoint.pointValue, pointValueScoredUpdate);
          newPlayerAdditiveScore = [...playerStatistic.additiveScore]
          newPlayerAdditiveScore.push(newPlayerNettoScore);
      }
      const newPlayerStatistic = new Statistic(
        newPlayerNettoScore, 
        newPlayerBruttoScore ?? playerStatistic.bruttoScore, 
        newPlayerShotsTaken ?? playerStatistic.shotsTaken, 
        newPlayerPointValueScored ?? playerStatistic.pointValueScored,
        newPlayerAdditiveScore ?? playerStatistic.additiveScore,
        newPlayerSufferedMalus ?? playerStatistic.sufferedMalus
        )
      newStatistic.set(player, newPlayerStatistic)
  });
  console.log("newStats ", newStatistic, newStatistic.keys)
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
}

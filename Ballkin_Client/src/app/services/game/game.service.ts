import { Injectable } from '@angular/core';
import { BehaviorSubject, map, merge, tap } from 'rxjs';
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

  private statisticsHistory: Map<Player, Statistic>[] = [];

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

  //Statistic Observables
  private playerOneGamePointsSubject = new BehaviorSubject<number>(0);
  playerOneGamePoints$ = this.playerOneGamePointsSubject.asObservable();

  private playerTwoGamePointsSubject = new BehaviorSubject<number>(0);
  playerTwoGamePoints$ = this.playerTwoGamePointsSubject.asObservable();

  private playerOneAvgGamePointsSubject = new BehaviorSubject<number>(0);
  playerOneAvgGamePoints$ = this.playerOneAvgGamePointsSubject.asObservable();

  private playerOneAdditiveGamePointsSubject = new BehaviorSubject<number[]>([]);
  playerOneAdditiveGamePoints$ = this.playerOneAdditiveGamePointsSubject.asObservable();

  private playerTwoAvgGamePointsSubject = new BehaviorSubject<number>(0);
  playerTwoAvgGamePoints$ = this.playerTwoAvgGamePointsSubject.asObservable();

  private playerOneShotsTakenSubject = new BehaviorSubject<number>(0);
  playerOneShotsTaken$ = this.playerOneShotsTakenSubject.asObservable();

  private playerTwoShotsTakenSubject = new BehaviorSubject<number>(0);
  playerTwoShotsTaken$ = this.playerTwoShotsTakenSubject.asObservable();

  private playerTwoAdditiveGamePointsSubject = new BehaviorSubject<number[]>([]);
  playerTwoAdditiveGamePoints$ = this.playerTwoAdditiveGamePointsSubject.asObservable();

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

  constructor() { 
    this.calculateStatistics()
  }


  addGamePoint(newGamePoint: PlayerGamePoint) {
    this.gamePointsSubject.next([...this.gamePointsSubject.value, newGamePoint]);
    this.newcalculateStatistics(newGamePoint);
  }

  recordPlayerScore(player: Player, pointValue: number) {
  const moneyballInPlay = this.moneyballEnabled ? this.popMoneyball() : undefined;
  const newGamePoint = new PlayerGamePoint(player, pointValue, moneyballInPlay);
  this.gamePointsSubject.next([...this.gamePointsSubject.value, newGamePoint]);
  console.log(this.gamePointsSubject.value);
  this.newcalculateStatistics(newGamePoint);

  }

  newaddGamePoint(newGamePoint: PlayerGamePoint){
    this.gamePointsSubject.next([...this.gamePointsSubject.value, newGamePoint]);
    this.newcalculateStatistics(newGamePoint);

  }

  newundo(){
    this.statisticsHistory.pop();
    this.currentStatisticSubject.next(this.statisticsHistory[this.statisticsHistory.length-1])
    this.gamePointsSubject.next([...this.gamePointsSubject.value.slice(0, -1)])
  }

  newcalculateStatistics(newGamePoint: PlayerGamePoint){
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
      let newPlayerSufferedMalus;
      if (player !== newGamePoint.player) {
          newPlayerNettoScore = playerStatistic.nettoScore - (newGamePoint.moneyball?.multiplierForOpponent ?? 1) * newGamePoint.pointValue;
          newPlayerSufferedMalus = playerStatistic.sufferedMalus + (newGamePoint.moneyball?.multiplierForOpponent ?? 1) * newGamePoint.pointValue;

      } else {
          newPlayerNettoScore = playerStatistic.nettoScore + (newGamePoint.moneyball?.multiplierForShooter ?? 1) * newGamePoint.pointValue;
          newPlayerBruttoScore = playerStatistic.bruttoScore + newGamePoint.pointValue;
          newPlayerShotsTaken = playerStatistic.shotsTaken + 1;
          newPlayerPointValueScored = playerStatistic.pointValueScored;
          const pointValueScoredUpdate = (newPlayerPointValueScored.get(newGamePoint.pointValue)?? 0) + 1;
          newPlayerPointValueScored.set(newGamePoint.pointValue, pointValueScoredUpdate);
      }
      const newPlayerStatistic = new Statistic(
        newPlayerNettoScore, 
        newPlayerBruttoScore ?? playerStatistic.bruttoScore, 
        newPlayerShotsTaken ?? playerStatistic.shotsTaken, 
        newPlayerPointValueScored ?? playerStatistic.pointValueScored, 
        newPlayerSufferedMalus ?? playerStatistic.sufferedMalus
        )
      newStatistic.set(player, newPlayerStatistic)
  });
  console.log("newStats ", newStatistic, newStatistic.keys)
  this.statisticsHistory.push(newStatistic);
  this.currentStatisticSubject.next(newStatistic);
  
  }

  calculateStatistics(){
    merge(this.gamePoints$, this.playerOne$, this.playerTwo$).pipe(
      tap(() => {
        const gamePoints = this.gamePointsSubject.getValue();
        this.calculatePlayersScore(gamePoints);
        this.calculatePlayersShotsTaken(gamePoints);
        this.calculatePlayersAvgScore(gamePoints);
        this.calculateAdditiveGamePoints(gamePoints);
      })
    ).subscribe();
  }

  calculatePlayersScore(gamePoints: PlayerGamePoint[]){
    const playerOnePoints = gamePoints
          .filter(x => x.player === this.playerOneSubject.getValue())
          .map(x => (x.moneyball ? (x.pointValue * x.moneyball.multiplierForShooter) : x.pointValue) * (x.multiplier ?? 1))
          .reduce((total, currentValue) => total + currentValue, 0);
  
        const playerTwoMalusPoints = gamePoints
          .filter(x => x.player === this.playerTwoSubject.getValue())
          .map(x => (x.moneyball ? (x.pointValue * x.moneyball.multiplierForOpponent) : 0) * (x.multiplier ?? 1))
          .reduce((total, currentValue) => total + currentValue, 0);
          
        this.playerOneGamePointsSubject.next(playerOnePoints + playerTwoMalusPoints)

        const playerTwoPoints = gamePoints
          .filter(x => x.player === this.playerTwoSubject.getValue())
          .map(x => (x.moneyball ? (x.pointValue * x.moneyball.multiplierForShooter) : x.pointValue) * (x.multiplier ?? 1))
          .reduce((total, currentValue) => total + currentValue, 0);
  
        const playerOneMalusPoints = gamePoints
          .filter(x => x.player === this.playerOneSubject.getValue())
          .map(x => (x.moneyball ? (x.pointValue * x.moneyball.multiplierForOpponent) : 0) * (x.multiplier ?? 1))
          .reduce((total, currentValue) => total + currentValue, 0);

        this.playerTwoGamePointsSubject.next(playerTwoPoints + playerOneMalusPoints)
  }

  calculateAdditiveGamePoints(gamePoints: PlayerGamePoint[]){
    let playerOneSum = 0;
    const playerOneAdditiveScore = gamePoints.map(x => {
      if (x.player === this.playerOneSubject.getValue()){
        return playerOneSum = (x.moneyball ? (x.pointValue * x.moneyball.multiplierForShooter) : x.pointValue) * (x.multiplier ?? 1) + playerOneSum;
      }
      else {
        playerOneSum = (x.moneyball ? (x.pointValue * x.moneyball.multiplierForOpponent) : 0) * (x.multiplier ?? 1) + playerOneSum;
        return undefined;
      }
    })
    this.playerOneAdditiveGamePointsSubject.next([0, ...(playerOneAdditiveScore.filter(x => x !== undefined) as number[])]);

    let playerTwoSum = 0;
    const playerTwoAdditiveScore = gamePoints.map(x => {
      if (x.player === this.playerTwoSubject.getValue()){
        return playerTwoSum = (x.moneyball ? (x.pointValue * x.moneyball.multiplierForShooter) : x.pointValue) * (x.multiplier ?? 1) + playerTwoSum;
      }
      else {
        playerTwoSum = (x.moneyball ? (x.pointValue * x.moneyball.multiplierForOpponent) : 0) * (x.multiplier ?? 1) + playerTwoSum;
        return undefined;
      }
    })
    this.playerTwoAdditiveGamePointsSubject.next([0, ...(playerTwoAdditiveScore.filter(x => x !== undefined) as number[])]);
  }

  calculatePlayersShotsTaken(gamePoints: PlayerGamePoint[]){
    const playerOneShotsTaken =  gamePoints.filter(gamePoints => gamePoints.player === this.playerOneSubject.getValue()).length
    this.playerOneShotsTakenSubject.next(playerOneShotsTaken)
    const playerTwoShotsTaken =  gamePoints.filter(gamePoints => gamePoints.player === this.playerTwoSubject.getValue()).length
    this.playerTwoShotsTakenSubject.next(playerTwoShotsTaken)
  }

  calculatePlayersAvgScore(gamePoints: PlayerGamePoint[]){
    if (this.playerOneShotsTakenSubject.getValue() === 0){
      this.playerOneAvgGamePointsSubject.next(0)
    }
    else{
      const playerOneNettoScore = gamePoints.filter(x => x.player === this.playerOneSubject.getValue())
        .map(x => x.pointValue)
        .reduce((total, currentValue) => total + currentValue, 0);
      
      this.playerOneAvgGamePointsSubject.next(Number((playerOneNettoScore/this.playerOneShotsTakenSubject.getValue()).toFixed(2)))
    }

    if (this.playerTwoShotsTakenSubject.getValue() === 0){
      this.playerTwoAvgGamePointsSubject.next(0)
    }
    else{
      const playerTwoNettoScore = gamePoints.filter(x => x.player === this.playerTwoSubject.getValue())
        .map(x => x.pointValue)
        .reduce((total, currentValue) => total + currentValue, 0);
      
      this.playerTwoAvgGamePointsSubject.next(Number((playerTwoNettoScore/this.playerTwoShotsTakenSubject.getValue()).toFixed(2)))
    }
  }

  undo(){
    if (this.gamePointsSubject.value.length > 0){
      const undoneGamePoint = this.gamePointsSubject.value[this.gamePointsSubject.value.length-1]
      if (undoneGamePoint.moneyball){
        this.moneyBallQueueSubject.next([...this.moneyBallQueueSubject.value.slice(1), undoneGamePoint.moneyball])
      }
      this.gamePointsSubject.next([...this.gamePointsSubject.value.slice(0, -1)])
    }
  }

  resetGame(){
    this.gamePointsSubject.next([]);
  }

  //doesnt need to be in the service
  calculatePointValuePercentage(player: Player, pointValue: number) {
    return this.gamePoints$.pipe(
      map(gamePoints => {
        const shotCount = gamePoints.filter(x => x.player === player).length;
        if (shotCount === 0) {
          return 0;
        }
        const pointValueHitPercentage = gamePoints
          .filter(x => x.player === player)
          .map(x => x.pointValue)
          .filter(x => x === pointValue)
          .length / shotCount;
        return Number((pointValueHitPercentage * 100).toFixed(0));
      })
    );
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

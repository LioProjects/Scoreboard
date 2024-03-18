import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';
import { OneVsOneGameModeState } from '../../game-modes/one-vs-one-game-mode/one-vs-one-game-mode-state';
import { GameModeState } from '../../interfaces/game-mode-state/game-mode-state';
import { MONEYBALLS, Moneyball } from '../../models/moneyball/moneyball.model';
import { PlayerGamePoint } from '../../models/player-game-point/player-game-point.model';
import { Player } from '../../models/player/player.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private gamePointsSubject = new BehaviorSubject<PlayerGamePoint[]>([]);
  gamePoints$ = this.gamePointsSubject.asObservable();

  private playerOneSubject = new BehaviorSubject<Player | undefined>(undefined);
  playerOne$ = this.playerOneSubject.asObservable();

  private playerTwoSubject = new BehaviorSubject<Player | undefined>(undefined);
  playerTwo$ = this.playerTwoSubject.asObservable();

  private gameModeSubject = new BehaviorSubject<GameModeState>(new OneVsOneGameModeState(this));
  gameMode$ = this.gameModeSubject.asObservable();

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

  constructor() { }

  recordPlayerScore(player: Player, pointValue: number) {
    const moneyballInPlay = this.moneyballEnabled ? this.getNextMoneyball() : undefined;
    const newGamePoint = new PlayerGamePoint(player, pointValue, moneyballInPlay);
    this.gamePointsSubject.next([...this.gamePointsSubject.value, newGamePoint]);
    console.log(this.gamePointsSubject.getValue())

  }


  //todo: circular dependancy problem with this observable. check callers
  getPlayerScore(player: Player): Observable<number>{
    let opponent: Player | undefined;
    if (player === this.playerOneSubject.getValue()){
      opponent = this.playerTwoSubject.getValue();
    }
    else{
      opponent = this.playerOneSubject.getValue();
    }
    return this.gamePoints$.pipe(
      map(gamePoints => {

        const shooterPoints = gamePoints
          .filter(x => x.player === player)
          .map(x => (x.moneyball ? (x.pointValue * x.moneyball.multiplierForShooter) : x.pointValue) * (x.multiplier ?? 1))
          .reduce((total, currentValue) => total + currentValue, 0);
  
        const opponentMinusPoints = gamePoints
          .filter(x => x.player === opponent)
          .map(x => (x.moneyball ? (x.pointValue * x.moneyball.multiplierForOpponent) : 0) * (x.multiplier ?? 1))
          .reduce((total, currentValue) => total + currentValue, 0);
        console.log("shooterpoints: " , shooterPoints, " opponentmalus ", opponentMinusPoints, " caller ", player)
        return shooterPoints + opponentMinusPoints;
      })
    );
  
  }

  //avg without counting Opponent Malus
  getPlayerAvgScore(player: Player): Observable<number>{
    return this.getPlayerShotsTaken(player).pipe(
      switchMap(shotsTaken => {
        return this.gamePoints$.pipe(
          map(gamePoints => {
            
            if (shotsTaken === 0){
              return 0;
            }
            const shooterPoints = gamePoints
              .filter(x => x.player === player)
              .map(x => (x.moneyball ? (x.pointValue * x.moneyball.multiplierForShooter) : x.pointValue) * (x.multiplier ?? 1))
              .reduce((total, currentValue) => total + currentValue, 0);

            return Number((shooterPoints/shotsTaken).toFixed(2));
          })
        )
      })
    )
  }

  getPlayerShotsTaken(player: Player): Observable<number>{
    return this.gamePoints$.pipe(
      map(gamePoints => {
        console.log(gamePoints.filter(x => x.player === player).length)
        return gamePoints.filter(x => x.player === player).length;
      })
    )
  }

  addGamePoint(gamePoints: PlayerGamePoint){
    this.gamePointsSubject.next([...this.gamePointsSubject.getValue(), gamePoints])
  }

  undo(){
    if (this.gamePointsSubject.value.length > 0){
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
  
  getMoneyballQueue(): Moneyball[] {
    return this.moneyballQueue;
  }

  getNextMoneyball(): Moneyball {
    if(this.moneyballQueue.length > 0){
      const randomMoneyballId = Math.floor(Math.random() * 3) + 1;
      const randomMoneyball = this.getMoneyballById(randomMoneyballId);
      if (randomMoneyball) {
        this.moneyballQueue.unshift(randomMoneyball);
        return this.moneyballQueue.pop()!;
      }
    }
    return {id: 1, multiplierForShooter: 1, multiplierForOpponent: 0}
  }

  private getMoneyballById(id: number): Moneyball | undefined {
    return MONEYBALLS.find(moneyball => moneyball.id === id);
  }

}

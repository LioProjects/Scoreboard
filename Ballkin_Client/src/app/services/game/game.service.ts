import { Injectable } from '@angular/core';
import { Moneyball } from '../../models/moneyball/moneyball.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  //in assetservice along with the playernames
  private moneyballs: { [id: number]: Moneyball } = {
    1: {id: 1, multiplierForShooter: 1, multiplierForOpponent: 0},
    2: {id: 2, multiplierForShooter: 2, multiplierForOpponent: 0},
    3: {id: 3, multiplierForShooter: 1, multiplierForOpponent: -1},
  };

  private moneyballQueue: Moneyball[] = [
    {id: 1, multiplierForShooter: 1, multiplierForOpponent: 0},
    {id: 2, multiplierForShooter: 2, multiplierForOpponent: 0},
    {id: 3, multiplierForShooter: 1, multiplierForOpponent: -1},
  ]

  constructor() { }
  
  getMoneyballQueue(): Moneyball[] {
    return this.moneyballQueue;
  }

  getMoneyballById(id: number): Moneyball | undefined {
    return this.moneyballs[id];
  }

  getCurrentMoneyball(): Moneyball {
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
}

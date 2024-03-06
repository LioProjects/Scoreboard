import { Injectable } from '@angular/core';
import { MONEYBALLS, Moneyball } from '../../models/moneyball/moneyball.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private moneyballQueue: Moneyball[] = [
    {id: 1, multiplierForShooter: 1, multiplierForOpponent: 0},
    {id: 2, multiplierForShooter: 2, multiplierForOpponent: 0},
    {id: 3, multiplierForShooter: 3, multiplierForOpponent: -1},
  ]

  constructor() { }
  
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

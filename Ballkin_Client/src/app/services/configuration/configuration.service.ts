import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor() { }

  private pointValueListSubject = new BehaviorSubject<number[]>([0 ,1, 2, 3, 4]);
  pointValueList$ = this.pointValueListSubject.asObservable();

  private takeTurnsSubject = new BehaviorSubject<boolean>(true);
  takeTurns$ = this.takeTurnsSubject.asObservable();

  setPointValueList(numberList: number[]){
    this.pointValueListSubject.next(numberList)
  }

  setTakeTurns(takeTurn: boolean){
    this.takeTurnsSubject.next(takeTurn);
  }

}

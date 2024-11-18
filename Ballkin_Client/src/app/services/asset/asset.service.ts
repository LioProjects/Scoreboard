import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private moneyballImages: { [id: number]: string } = {
    1: 'assets/icons/moneyball/basketball_normal.png',
    2: 'assets/icons/moneyball/basketball_red.png',
    3: 'assets/icons/moneyball/basketball_blue.png',
    // Add more image sources as needed
  };
  constructor() { }

  getMoneyballImageById(id: number): string{
    return this.moneyballImages[id];
  }
}

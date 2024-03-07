import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  private moneyballImages: { [id: number]: string } = {
    1: 'assets/basketball_normal.png',
    2: 'assets/basketball_red_fire.png',
    3: 'assets/basketball_ice.png',
    // Add more image sources as needed
  };
  constructor() { }

  getMoneyballImageById(id: number): string{
    return this.moneyballImages[id];
  }
}

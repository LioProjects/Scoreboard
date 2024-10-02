import { Injectable } from '@angular/core';
import axios from 'axios';
import { Player } from '../../models/player/player.model';
import { Game } from '../../models/game/game.model';
import { PlayerService } from '../player/player.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  
  URL = 'http://localhost:5000/statistics';

  constructor() { }
//Todo: if i would not work with a map as game i could ommit most of it
  getGames = async (): Promise<Game[]> => {    
    try {
      const response = await axios.get(this.URL);
      const games = response.data.map((gameData: any) => {
        gameData.playerStatistics.forEach((statistic: any) => {
          statistic.pointValueScored = new Map<number, number>(
            Object.entries(statistic.pointValueScored).map(([key, value]) => {
              return [Number(key), Number(value)]; 
            })
          );
          statistic.avgPointValueScored = new Map<number, number>(
            Object.entries(statistic.avgPointValueScored).map(([key, value]) => {
              return [Number(key), Number(value)]; 
            })
          );
        });
        return new Game(gameData.playerStatistics);
      });
      return games as Game[];
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
};
}

import { Injectable } from '@angular/core';
import axios from 'axios';
import { Player } from '../../models/player/player.model';
import { Game } from '../../models/game/game.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {

  
  URL = 'http://localhost:5000/statistics';

  constructor() { }

  getGames = async (): Promise<Game[]> => {    
    try {
      const response = await axios.get(this.URL)
        return response.data as Game[];
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  };

  getStatisticByPlayer(player: Player){
    //
  }


  
}

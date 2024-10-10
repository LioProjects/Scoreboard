import axios from 'axios';
import { Player } from '../../models/player/player.model';
import { Statistic } from '../../models/statistic/statistic.model';
import { Game } from '../../models/game/game.model';
import { Injectable } from '@angular/core';
import { PlayerStatistic } from '../../models/player-statistic.model';

const BASE_URL = 'http://localhost:5000'; // Adjust to your backend URL
const STATISTIC_ENDPOINT = `${BASE_URL}/statistics`;

@Injectable({
  providedIn: 'root'
})

export class GameApiService {
  
  // Todo: Complicated function only to convert (avg)pointValueScored to a map
  async getGames(): Promise<Game[]> {
    try {
      const response = await axios.get(STATISTIC_ENDPOINT);
      //Manually assign the prototype so instanceof works
      return response.data.map((game: any) => Object.setPrototypeOf(game, Game.prototype));
    } catch (error) {
      console.error('Error fetching games:', error);
      throw error;
    }
  }

  // Create a new game
  async createGame(gameData: Game): Promise<Game> {
    try {
      const response = await axios.post(STATISTIC_ENDPOINT, gameData);
      return response.data;
    } catch (error) {
      console.error('Error creating game:', error);
      throw error;
    }
  }

  // Delete a game by ID
  async deleteGame(id: string): Promise<void> {
    try {
      await axios.delete(`${STATISTIC_ENDPOINT}/${id}`);
    } catch (error) {
      console.error('Error deleting game:', error);
      throw error;
    }
  }

  async getPlayerStatistics(): Promise<PlayerStatistic[]>{
    try{
      const response = await axios.get(`${STATISTIC_ENDPOINT}/players`);
      return response.data.map((playerStatistic: any) => Object.setPrototypeOf(playerStatistic, PlayerStatistic.prototype));
    } catch (error){
      console.error('Error fetching PlayerStatistics:', error )
      throw error;
    }
  }

}
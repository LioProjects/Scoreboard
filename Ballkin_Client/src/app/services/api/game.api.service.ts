import axios from 'axios';
import { Player } from '../../models/player/player.model';
import { Statistic } from '../../models/statistic/statistic.model';
import { Game } from '../../models/game/game.model';
import { Injectable } from '@angular/core';

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
  }

  // Create a new game
  async createGame(gameData: Game): Promise<Game> {
    try {
      const response = await axios.post(STATISTIC_ENDPOINT, this.convertGameToGameWithoutMaps(gameData));
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

  convertGameToGameWithoutMaps(game: Game){
    const statisticArray = game.playerStatistics.map(statistic => ({
    playerId : statistic.playerId,
    nettoScore: statistic.nettoScore,
    bruttoScore: statistic.bruttoScore,
    shotsTaken: statistic.shotsTaken,
    avgBruttoScore: statistic.avgBruttoScore,
    pointValueScored: Object.fromEntries(statistic.pointValueScored.entries()), 
    avgPointValueScored: Object.fromEntries(statistic.avgPointValueScored.entries()),
    sufferedMalus: statistic.sufferedMalus,
    additiveScore: statistic.additiveScore
    })
    )
    const convertedGame = { playerStatistics: statisticArray };
    return convertedGame;
  }
}
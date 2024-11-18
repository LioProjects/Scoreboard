import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of } from 'rxjs';
import { Player } from '../../models/player/player.model';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})

export class PlayerService {

  readonly BASE_URL = 'http://localhost:5000';

  readonly PLAYER_ENDPOINT = `${this.BASE_URL}/players`

  private cachedPlayers: Player[] | null = null; // Cache variable

  constructor() { }

  //Todo: When to invalidate cashe
  getPlayers(): Promise<Player[]> {
    if (this.cachedPlayers) {
      return Promise.resolve(this.cachedPlayers); // Return cached value as a resolved promise
    }
  
    return axios.get<Player[]>(this.PLAYER_ENDPOINT)
      .then(response => {
        this.cachedPlayers = response.data;
        return this.cachedPlayers;
      });
  }
  
  getPlayerNameById(playerId: number): Promise<string> {
    return this.getPlayers() 
      .then(players => {
        const player = players.find(player => player._id === playerId);
        if (!player) {
          throw new Error('Player not found');
        }
        return player.name;
      })
      .catch(err => {
        console.error(err.message);
        return 'Unknown Player'; 
      });
  }
  
}

/*
getPlayerById(id: number): Observable<Player | undefined> {
  // Simulate fetching a player by ID from a server
  const player = this.players.find(p => p._id === id);
  return of(player);
}

addPlayer(player: Player): Observable<Player[]> {
  // Simulate adding a player to the list
  this.players.push(player);
  return of(this.players);
}

deletePlayer(id: number): Observable<Player[]> {
  // Simulate deleting a player from the list
  this.players = this.players.filter(p => p._id !== id);
  return of(this.players);
}

updatePlayer(updatedPlayer: Player): Observable<Player[]> {
  // Simulate updating a player in the list
  const index = this.players.findIndex(p => p._id === updatedPlayer._id);
  if (index !== -1) {
    this.players[index] = updatedPlayer;
  }
  return of(this.players);
}*/


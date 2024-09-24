import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { Player } from '../../models/player/player.model';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})

export class PlayerService {

  readonly BASE_URL = 'http://localhost:5000';

  readonly PLAYER_ENDPOINT = `${this.BASE_URL}/players`
  
constructor() { }

getBackendPlayers(): Observable<Player[]> {
  return from(
    axios.get<Player[]>(this.PLAYER_ENDPOINT).then(response => response.data)
  );

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
}

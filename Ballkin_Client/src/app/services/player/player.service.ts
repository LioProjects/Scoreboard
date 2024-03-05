import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Player } from '../../models/player/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  
  private players: Player[] = [
  { id: 1, name: 'Lionel' },
  { id: 2, name: 'Noel' },
  { id: 3, name: 'Nico' },
  { id: 4, name: 'Johannes' }
];

constructor() { }

getPlayers(): Observable<Player[]> {
  // Simulate fetching players from a server
  return of(this.players);
}

getPlayerById(id: number): Observable<Player | undefined> {
  // Simulate fetching a player by ID from a server
  const player = this.players.find(p => p.id === id);
  return of(player);
}

addPlayer(player: Player): Observable<Player[]> {
  // Simulate adding a player to the list
  this.players.push(player);
  return of(this.players);
}

deletePlayer(id: number): Observable<Player[]> {
  // Simulate deleting a player from the list
  this.players = this.players.filter(p => p.id !== id);
  return of(this.players);
}

updatePlayer(updatedPlayer: Player): Observable<Player[]> {
  // Simulate updating a player in the list
  const index = this.players.findIndex(p => p.id === updatedPlayer.id);
  if (index !== -1) {
    this.players[index] = updatedPlayer;
  }
  return of(this.players);
}
}

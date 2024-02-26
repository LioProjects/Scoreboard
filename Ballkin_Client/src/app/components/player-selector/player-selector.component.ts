import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, of, switchMap } from 'rxjs';
import { Player } from '../../models/player/player.model';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-player-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-selector.component.html',
  styleUrl: './player-selector.component.scss'
})

export class PlayerSelectorComponent{
  @Input() selectedPlayer: Player | undefined;
  @Output() selectedPlayerChange = new EventEmitter<Player>();
  
  players$: Observable<Player[]>;

  constructor(private playerService: PlayerService) {
    this.players$ = this.playerService.getPlayers()
      .pipe(
        switchMap(players => {
          // Handle the asynchronous operation here if needed
          return of(players); // Return the players array
        })
      );
      console.log("available players are" + this.players$)
  }

  onPlayerSelect(player: Player) {
    this.selectedPlayer = player;
    console.log("player selected: " + this.selectedPlayer.name)
    this.selectedPlayerChange.emit(player);
  }
}
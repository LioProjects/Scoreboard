import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Player } from '../../models/player/player.model';
import { PlayerService } from '../../services/player/player.service';

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
    this.players$ = this.playerService.getPlayers();
  }

  //needs rework. check id instead of names (if two names are the same we fucked)
  onPlayerSelect(event: Event) {
    const selectedPlayerName = (event.target as HTMLSelectElement).value;
    this.players$.subscribe(players => {
      const selectedPlayer = players.find(player => player.name === selectedPlayerName);
      console.log(selectedPlayerName)
      this.selectedPlayerChange.emit(selectedPlayer);
    });
  }
}
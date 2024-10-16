import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Player } from '../../models/player/player.model';
import { PlayerService } from '../../services/player/player.service';

@Component({
  selector: 'app-player-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-selector.component.html',
  styleUrl: './player-selector.component.scss'
})

export class PlayerSelectorComponent {
  @Input() selectedPlayer: Player | null = null;
  @Output() selectedPlayerChange = new EventEmitter<{ previousPlayer: Player | null, newPlayer: Player | null }>();

  players: Player[] = [];

  private previousPlayer: Player | null = null;
  
  constructor(private playerService: PlayerService) {
    this.playerService.getPlayers().then(playerList => this.players = playerList)
  }

  ngOnInit() {
    this.previousPlayer = this.selectedPlayer; // Set initial previous player value
  }

  onPlayerSelect(newPlayer: Player) {
    this.selectedPlayerChange.emit({ previousPlayer: this.previousPlayer, newPlayer });
    this.previousPlayer = newPlayer;
  }
}
import { Component } from '@angular/core';
import { PlayerService } from '../../services/player/player.service';
import { GameService } from '../../services/game/game.service';
import { Player } from '../../models/player/player.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-player-selector-new',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './player-selector-new.component.html',
  styleUrl: './player-selector-new.component.scss',
})
export class PlayerSelectorNewComponent {
  selectedPlayers: Player[] = [];
  playerList: Player[] = [];
  dropdownVisible = true;

  constructor(
    private playerService: PlayerService,
    private gameService: GameService
  ) {}

  ngOnInit() {
    this.playerService
      .getPlayers()
      .then((_playerList) => (this.playerList = _playerList));
    this.gameService.selectedPlayers$.subscribe(
      (players) => (this.selectedPlayers = players)
    );
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  onPlayerToggle(player: any, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const isChecked = inputElement.checked;
    if (isChecked) {
      this.selectedPlayers.push(player);
    } else {
      this.selectedPlayers = this.selectedPlayers.filter(
        (p) => p._id !== player._id
      );
    }
    this.gameService.setPlayer(this.selectedPlayers);
  }

  isSelected(player: Player): boolean {
    return this.selectedPlayers.some((p) => p._id === player._id);
  }
}

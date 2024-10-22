import { Component } from '@angular/core';
import { PlayerService } from '../../../services/player/player.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-player.component.html',
  styleUrl: './add-player.component.scss'
})
export class AddPlayerComponent {
  formVisible = false;
  newPlayerName = '';
  errorMessage = '';

  constructor(private playerService: PlayerService){}

  toggleAddPlayerForm() {
    this.formVisible = !this.formVisible;
    this.newPlayerName = '';
    this.errorMessage = '';
  }

  addNewPlayer() {
    this.playerService.addPlayer(this.newPlayerName).catch(err => this.errorMessage = err.message)
  }
}

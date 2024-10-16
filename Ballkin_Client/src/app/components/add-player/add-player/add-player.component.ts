import { Component } from '@angular/core';
import { PlayerService } from '../../../services/player/player.service';

@Component({
  selector: 'app-add-player',
  standalone: true,
  imports: [],
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

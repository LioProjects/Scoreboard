import { Component, Input } from '@angular/core';
import { Player } from '../../models/player/player.model';
import { GameService } from '../../services/game/game.service';

@Component({
  selector: 'app-scoreboard-point-button',
  standalone: true,
  imports: [],
  templateUrl: './scoreboard-point-button.component.html',
  styleUrl: './scoreboard-point-button.component.scss'
})

//todo: input of gameservice
export class ScoreboardPointButtonComponent {
  @Input() player!: Player | null;
  @Input() pointValue!: number
  @Input() pointValuePercentage: number = 0;

  constructor(private gameService: GameService) {}

  onPointButtonClick() {
    if (this.player) {
      this.gameService.recordPlayerScore(this.player, this.pointValue);
    }
  }
}

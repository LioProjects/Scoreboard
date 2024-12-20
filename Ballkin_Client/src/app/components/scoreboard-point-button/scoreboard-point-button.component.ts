import { Component, Input } from '@angular/core';
import { Player } from '../../models/player/player.model';
import { GameService } from '../../services/game/game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scoreboard-point-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scoreboard-point-button.component.html',
  styleUrl: './scoreboard-point-button.component.scss'
})

//todo: input of gameservice
export class ScoreboardPointButtonComponent {
  @Input() player!: Player | null;
  @Input() pointValue!: number
  @Input() pointValuePercentage: number = 0;
  
  animated: boolean = false;

  constructor(private gameService: GameService) {}

  onPointButtonClick() {
    if (this.player) {
      this.gameService.recordPlayerScore(this.player, this.pointValue);
      this.showScoringAnimation();
    }
  }

  round(number: number): number{
    return Math.round(number);
  }

  showScoringAnimation(){
    this.animated = true;
    setTimeout(() => this.animated = false, 1000);
  }
}

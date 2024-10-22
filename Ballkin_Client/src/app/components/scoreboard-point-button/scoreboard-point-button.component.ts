import { Component, HostListener, Input } from '@angular/core';
import { Player } from '../../models/player/player.model';
import { GameService } from '../../services/game/game.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';

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
  playerTurns: Player | null = null;
  playerTurn: Subscription = new Subscription();

  enabled: boolean = false;
  animated: boolean = false;

  constructor(private gameService: GameService) {}

  ngOnChanges(){
    this.playerTurn = this.gameService.currentPlayerTurn$.subscribe(playerTurn =>{
      this.playerTurns= playerTurn
      if (this.player && this.player === playerTurn){
        this.enabled = true;
      } else {
        this.enabled = false;
      }
    });
  }

  onPointButtonClick() {
    if (this.player) {
      this.gameService.recordPlayerScore(this.player, this.pointValue);
      this.showScoringAnimation();
    }
  }

  round(number: number): number{
    return Math.round(number);
  }

  isButtonDisabled(): boolean{
    return !this.player || !this.enabled;
  }

  showScoringAnimation(){
    this.animated = true;
    setTimeout(() => this.animated = false, 500);
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.enabled) {
      return;
    }
    if (event.key === `${this.pointValue}`) {
      this.onPointButtonClick();
    }
  }
}

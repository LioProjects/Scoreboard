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
  styleUrl: './scoreboard-point-button.component.scss',
})

//todo: input of gameservice
export class ScoreboardPointButtonComponent {
  @Input() player!: Player | null;
  @Input() pointValue!: number;
  @Input() pointValuePercentage: number = 0;
  playerTurns: Player | null = null;
  playerTurn: Subscription = new Subscription();

  enabled: boolean = false;
  animated: boolean = false;

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.playerTurn = this.gameService.currentPlayerTurn$.subscribe(
      (playerTurn) => {
        this.playerTurns = playerTurn;
        this.enabled = this.player != null && this.player === playerTurn;
        console.warn('switch player on button', this.player, this.enabled);
      }
    );
  }

  onPointButtonClick() {
    if (this.player) {
      this.gameService.recordPlayerScore(this.player, this.pointValue);
      this.showScoringAnimation();
    }
  }

  round(number: number): number {
    return Math.round(number);
  }

  isButtonDisabled(): boolean {
    return !this.player || !this.enabled;
  }

  showScoringAnimation() {
    this.animated = true;
    setTimeout(() => (this.animated = false), 500);
  }
/*
  HostLIstener() {
    this.handleKeyDown1();
    this.handleKeyDown2();
    this.handleKeyDown3();
    this.handleKeyDown4();
    this.handleKeyDown5();
    this.handleKeyDown6();
  }*/

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (!this.enabled) {
      return;
    }
    if (event.key === `${this.pointValue}`) {
      this.onPointButtonClick();

      //Todo: currently 5 hostlistener. transfer this to scoreboard to have only one. 
      
      //Since there are 10 buttons and each one of them are registered to listen...Angular calls them in order of the DOM.
      //Player 1 is enabled because its his turn. Player 1 scores so the Playerturn in service is called.
      //This changes the player 2 as playerturn
      //And this happens before Angular could call the second listener (matching pointbutton of player 2) so now it calls it because its enabled
      event.stopImmediatePropagation();
    }
  }

  ngOnDestroy() {
    this.playerTurn.unsubscribe();
  }
}

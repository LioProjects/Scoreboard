import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
export class ScoreboardPointButtonComponent implements OnInit, OnChanges, OnDestroy {
  @Input() pointValue!: number;
  @Input() player!: Player | undefined;

  pointValuePercentage: number = 0;
  private percentageSubscription: Subscription = new Subscription();

  constructor(private gameService: GameService) {}

  ngOnInit() {
    if (this.player) {
      this.subscribeToPointValuePercentage();
    }
  }

  ngOnChanges() {
    if (this.player) {
      this.subscribeToPointValuePercentage();
    } else {
      this.unsubscribeFromPointValuePercentage();
    }
  }

  ngOnDestroy() {
    this.unsubscribeFromPointValuePercentage();
  }

  //todo: this doesnt need to be. either input gamepoints$
  subscribeToPointValuePercentage() {
    this.percentageSubscription = this.gameService
      .calculatePointValuePercentage(this.player!, this.pointValue)
      .subscribe(percentage => {
        this.pointValuePercentage = percentage;
      });
  }

  unsubscribeFromPointValuePercentage() {
    this.percentageSubscription.unsubscribe();
  }

  onPointButtonClick() {
    if (this.player) {
      this.gameService.recordPlayerScore(this.player, this.pointValue);
    }
  }
}

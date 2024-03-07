
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Moneyball } from '../../models/moneyball/moneyball.model';
import { PlayerGamePoint } from '../../models/player-game-point/player-game-point.model';
import { Player } from '../../models/player/player.model';
import { GameService } from '../../services/game/game.service';
import { MoneyballQueueComponent } from "../moneyball-queue/moneyball-queue.component";
import { PlayerSelectorComponent } from "../player-selector/player-selector.component";
import { ScoreboardGraphComponent } from "../scoreboard-graph/scoreboard-graph.component";
import { ScoreboardPointButtonComponent } from '../scoreboard-point-button/scoreboard-point-button.component';

@Component({
    selector: 'app-scoreboard',
    standalone: true,
    templateUrl: './scoreboard.component.html',
    styleUrl: './scoreboard.component.scss',
    imports: [ScoreboardPointButtonComponent, PlayerSelectorComponent, ScoreboardGraphComponent, MoneyballQueueComponent, FormsModule, CommonModule]
})
export class ScoreboardComponent {

    moneyballEnabled: boolean = false;
    player1: Player | undefined;
    player2: Player | undefined;
    gameMode: string = "1v1";
    gamePoints: PlayerGamePoint[] = [];
    moneyballQueue: Moneyball[] = [];
  
    gamePointsSubscription: Subscription = new Subscription();
    playerOneSubscription: Subscription = new Subscription();
    playerTwoSubscription: Subscription = new Subscription();
  
    constructor(private gameService: GameService) {}
  
    ngOnInit() {
      this.subscribeToGamePoints();
      this.subscribeToPlayerOne();
      this.subscribeToPlayerTwo();
      this.moneyballQueue = this.gameService.getMoneyballQueue();
    }
  
    subscribeToGamePoints() {
      this.gamePointsSubscription = this.gameService.gamePoints$.subscribe(gamePoints => {
        this.gamePoints = gamePoints;
      });
    }

    subscribeToPlayerOne(){
      this.playerOneSubscription = this.gameService.playerOne$.subscribe(playerOne => {
        this.player1 = playerOne;
      })
    }

    subscribeToPlayerTwo(){
      this.playerOneSubscription = this.gameService.playerTwo$.subscribe(playerTwo => {
        this.player2 = playerTwo;
      })
    }
  
    ngOnDestroy() {
      this.gamePointsSubscription.unsubscribe();
      this.playerOneSubscription.unsubscribe();
      this.playerTwoSubscription.unsubscribe();
    }
  
    onPlayer1Change(player: Player) {
      this.gameService.setPlayerOne(player);
    }
  
    onPlayer2Change(player: Player) {
      this.gameService.setPlayerTwo(player);
    }
  
    undo() {
      this.gameService.undo();
    }
  
    resetGame() {
      this.gameService.resetGame();
    }
  
    saveGame() {
      console.log("save Game to be implemented");
    }
  
    getAvgPlayerScore(player: Player | undefined): number {
      if (!player) {
        return 0;
      }
      const playerShotsTaken = this.getPlayerShotsTaken(player);
      if (playerShotsTaken === 0) {
        return 0;
      }
      return Number((this.getPlayerScore(player) / playerShotsTaken).toFixed(2));
    }
  
    getPlayerScore(player: Player | undefined): number {
      if (!player) {
        return 0;
      }
      return this.gamePoints.filter(x => x.player === player).map(x => x.moneyball ? x.pointValue * x.moneyball.multiplierForShooter : x.pointValue).reduce((total, currentValue) => total + currentValue, 0);
    }
  
    getPlayerShotsTaken(player: Player | undefined): number {
      if (!player) {
        return 0;
      }
      return this.gamePoints.filter(x => x.player === player).length
    }

    toggelMoneyball(){
        this.gameService.toggleMoneyball();
        this.moneyballEnabled = this.gameService.getMoneyballEnabled()
    }
  }


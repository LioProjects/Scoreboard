
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Moneyball } from '../../models/moneyball/moneyball.model';
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
    playerOne: Player | undefined;
    playerTwo: Player | undefined;
    playerOneGamePoints: number;
    playerTwoGamePoints: number;
    playerOneAvgGamePoints: number;
    playerTwoAvgGamePoints: number;
    playerOneShotsTaken: number;
    playerTwoShotsTaken: number;
    gameMode: string = "1v1";
    moneyballQueue: Moneyball[] = [];
  
    //gamePointsSubscription: Subscription = new Subscription();
    playerOneSubscription: Subscription = new Subscription();
    playerTwoSubscription: Subscription = new Subscription();
    playerOneGamePointsSubscription: Subscription = new Subscription();
    playerTwoGamePointsSubscription: Subscription = new Subscription();
    playerOneAvgGamePointsSubscription: Subscription = new Subscription();
    playerTwoAvgGamePointsSubscription: Subscription = new Subscription();
    playerOneShotsTakenSubscription: Subscription = new Subscription();
    playerTwoShotsTakenSubscription: Subscription = new Subscription();
  
    constructor(private gameService: GameService) {
      this.playerOneGamePoints = 0;
      this.playerTwoGamePoints = 0;
      this.playerOneAvgGamePoints = 0;
      this.playerTwoAvgGamePoints = 0;
      this.playerOneShotsTaken = 0;
      this.playerTwoShotsTaken = 0;
    }
  
    ngOnInit() {
      this.subscribeToPlayerOneAssets();
      this.subscribeToPlayerTwoAssets();
      this.moneyballQueue = this.gameService.getMoneyballQueue();
    }

    subscribeToPlayerOneAssets(){
      this.playerOneSubscription = this.gameService.playerOne$.subscribe(playerOne => {
        this.playerOne = playerOne;
      })
      this.playerOneGamePointsSubscription = this.gameService.playerOneGamePoints$.subscribe(gamePoints => {
        this.playerOneGamePoints = gamePoints;
      })
      this.playerOneAvgGamePointsSubscription = this.gameService.playerOneAvgGamePoints$.subscribe(avgGamePoints => {
        this.playerOneAvgGamePoints = avgGamePoints;
      })
      this.playerOneShotsTakenSubscription = this.gameService.playerOneShotsTaken$.subscribe(shotsTaken => {
        this.playerOneShotsTaken = shotsTaken;
      })
    }

    subscribeToPlayerTwoAssets(){
      this.playerTwoSubscription = this.gameService.playerTwo$.subscribe(playerTwo => {
        this.playerTwo = playerTwo;
      })
      this.playerTwoGamePointsSubscription = this.gameService.playerTwoGamePoints$.subscribe(gamePoints => {
        this.playerTwoGamePoints = gamePoints;
      })
      this.playerTwoAvgGamePointsSubscription = this.gameService.playerTwoAvgGamePoints$.subscribe(avgGamePoints => {
        this.playerTwoAvgGamePoints = avgGamePoints;
      })
      this.playerTwoShotsTakenSubscription = this.gameService.playerTwoShotsTaken$.subscribe(shotsTaken => {
        this.playerTwoShotsTaken = shotsTaken;
      })
    }
  
    ngOnDestroy() {
      this.playerOneSubscription.unsubscribe();
      this.playerTwoSubscription.unsubscribe();
      this.playerOneGamePointsSubscription.unsubscribe();
      this.playerTwoGamePointsSubscription.unsubscribe();
      this.playerOneAvgGamePointsSubscription.unsubscribe();
      this.playerTwoAvgGamePointsSubscription.unsubscribe();
      this.playerOneShotsTakenSubscription.unsubscribe();
      this.playerTwoShotsTakenSubscription.unsubscribe();
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

    toggelMoneyball(){
        this.gameService.toggleMoneyball();
        this.moneyballEnabled = this.gameService.getMoneyballEnabled()
    }
  }


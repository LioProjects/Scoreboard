
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OneVsOneGameModeState } from '../../game-modes/one-vs-one-game-mode/one-vs-one-game-mode-state';
import { GameModeState } from '../../interfaces/game-mode-state/game-mode-state';
import { Moneyball } from '../../models/moneyball/moneyball.model';
import { Player } from '../../models/player/player.model';
import { Statistic } from '../../models/statistic/statistic.model';
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

    playerOne: Player | undefined;
    playerTwo: Player | undefined;
    currentStatistic: Map<Player, Statistic> = new Map();
    moneyballQueue: Moneyball[] = [];
    moneyballEnabled: boolean = false;

    gameMode: GameModeState = new OneVsOneGameModeState(this.gameService);

    playerOneSubscription: Subscription = new Subscription();
    playerTwoSubscription: Subscription = new Subscription();
    currentStatisticSubscription: Subscription = new Subscription();
    gameModeSubscription: Subscription = new Subscription()
    moneyBallQueueSubscription: Subscription = new Subscription();


  
    constructor(private gameService: GameService) {
    }
  
    ngOnInit() {
      this.subscribeToPlayerOne();
      this.subscribeToPlayerTwo();
      this.subscribeToCurrentStatistic();
      this.subscribeToGameMode();
      this.subscribeToMoneyballQueue();
    }

    subscribeToPlayerOne(){
      this.playerOneSubscription = this.gameService.playerOne$.subscribe(playerOne => {
        this.playerOne = playerOne;
      })
    }

    subscribeToPlayerTwo(){
      this.playerTwoSubscription = this.gameService.playerTwo$.subscribe(playerTwo => {
        this.playerTwo = playerTwo;
      })
    }

    subscribeToCurrentStatistic(){
      this.currentStatisticSubscription = this.gameService.currentStatistic$.subscribe(currentStatistic => {
        this.currentStatistic = currentStatistic;
      })
    }

    subscribeToGameMode(){
      this.gameModeSubscription = this.gameService.gameMode$.subscribe(gameMode => {
        this.gameMode = gameMode;
      })
    }

    subscribeToMoneyballQueue(){
      this.moneyBallQueueSubscription = this.gameService.moneyBallQueueSubject$.subscribe(moneyballQueue => {
        this.moneyballQueue = moneyballQueue;
      })
    }
  
    ngOnDestroy() {
      this.playerOneSubscription.unsubscribe();
      this.playerTwoSubscription.unsubscribe();
      this.currentStatisticSubscription.unsubscribe();
      this.gameModeSubscription.unsubscribe();
      this.moneyBallQueueSubscription.unsubscribe();
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
      this.gameService.saveGame();
    }

    toggelMoneyball(){
        this.gameService.toggleMoneyball();
        this.moneyballEnabled = this.gameService.getMoneyballEnabled()
    }

    getGamemodes(): GameModeState[]{
      return this.gameService.getGameModes()
    }

    onGameModeSelect(event: Event) {
      const selectedGameModeName = (event.target as HTMLSelectElement).value;
      const newGameMode = this.getGamemodes().find(gameMode => gameMode.getName() === selectedGameModeName)
      if (newGameMode){
        this.gameService.setGameMode(newGameMode);
      }
      else{
        console.log("Could not find Gamemode in GamemodeList")
      }
    }
      
  }


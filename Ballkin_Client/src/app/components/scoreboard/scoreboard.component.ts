
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OneVsOneGameModeState } from '../../game-modes/one-vs-one-game-mode/one-vs-one-game-mode-state';
import { GameModeState } from '../../interfaces/game-mode-state/game-mode-state';
import { Moneyball } from '../../models/moneyball/moneyball.model';
import { Player } from '../../models/player/player.model';
import { GameService } from '../../services/game/game.service';
import { MoneyballQueueComponent } from "../moneyball-queue/moneyball-queue.component";
import { PlayerSelectorComponent } from "../player-selector/player-selector.component";
import { ScoreboardGraphComponent } from "../scoreboard-graph/scoreboard-graph.component";
import { ScoreboardPointButtonComponent } from '../scoreboard-point-button/scoreboard-point-button.component';
import { Game } from '../../models/game/game.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-scoreboard',
    standalone: true,
    templateUrl: './scoreboard.component.html',
    styleUrl: './scoreboard.component.scss',
    imports: [ScoreboardPointButtonComponent, PlayerSelectorComponent, ScoreboardGraphComponent, MoneyballQueueComponent, FormsModule, CommonModule]
})
export class ScoreboardComponent {
    //Todo: could omit playerOne(Two) because they are already in the currentStatistic. only an idea
    selectedPlayers: Player[] = [];
    currentStatistic: Game = new Game();
    moneyballQueue: Moneyball[] = [];
    moneyballEnabled: boolean = false;

    gameMode: GameModeState = new OneVsOneGameModeState(this.gameService);

    selectedPlayersSubscription: Subscription = new Subscription();
    currentStatisticSubscription: Subscription = new Subscription();
    gameModeSubscription: Subscription = new Subscription()
    moneyBallQueueSubscription: Subscription = new Subscription();


  
    constructor(private gameService: GameService, private router: Router) {
    }
  
    ngOnInit() {
      this.subscribeToSelectedPlayers();
      this.subscribeToCurrentStatistic();
      this.subscribeToGameMode();
      this.subscribeToMoneyballQueue();
    }

    subscribeToSelectedPlayers(){
      this.selectedPlayersSubscription = this.gameService.selectedPlayers$.subscribe(playerOne => {
        this.selectedPlayers = playerOne;
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
      this.currentStatisticSubscription.unsubscribe();
      this.gameModeSubscription.unsubscribe();
      this.moneyBallQueueSubscription.unsubscribe();
    }

    onPlayerChange({ previousPlayer, newPlayer }: { previousPlayer: Player | null, newPlayer: Player | null }){
      this.gameService.setPlayer(previousPlayer, newPlayer);
    }
  
    undo() {
      this.gameService.undo();
    }
  
    resetGame() {
      this.gameService.resetGame();
      console.log(this.currentStatistic)
    }
  
    saveGame() {
      this.gameService.saveGame();
    }

    toggelMoneyball(){
        this.gameService.toggleMoneyball();
        this.moneyballEnabled = this.gameService.getMoneyballEnabled()
    }

    routeToStatistics(){
      this.router.navigate(['/statistics'])
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

    getPlayerStatistic(playerId: number){
      return this.currentStatistic.playerStatistics.find(statistic => statistic.playerId === playerId);
    }
  }


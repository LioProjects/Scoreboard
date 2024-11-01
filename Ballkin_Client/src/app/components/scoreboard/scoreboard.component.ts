
import { CommonModule } from '@angular/common';
import { Component, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { OneVsOneGameModeState } from '../../game-modes/one-vs-one-game-mode/one-vs-one-game-mode-state';
import { GameModeState } from '../../interfaces/game-mode-state/game-mode-state';
import { Moneyball } from '../../models/moneyball/moneyball.model';
import { Player } from '../../models/player/player.model';
import { GameService } from '../../services/game/game.service';
import { MoneyballQueueComponent } from "../moneyball-queue/moneyball-queue.component";
import { ScoreboardGraphComponent } from "../scoreboard-graph/scoreboard-graph.component";
import { ScoreboardPointButtonComponent } from '../scoreboard-point-button/scoreboard-point-button.component';
import { Game } from '../../models/game/game.model';
import { Router } from '@angular/router';
import { ConfigPanelComponent } from '../config-panel/config-panel/config-panel.component';
import { ConfigurationService } from '../../services/configuration/configuration.service';

@Component({
    selector: 'app-scoreboard',
    standalone: true,
    templateUrl: './scoreboard.component.html',
    styleUrl: './scoreboard.component.scss',
    imports: [ConfigPanelComponent, ScoreboardPointButtonComponent, ScoreboardGraphComponent, MoneyballQueueComponent, FormsModule, CommonModule]
})
export class ScoreboardComponent {
    //Todo: could omit playerOne(Two) because they are already in the currentStatistic. only an idea
    selectedPlayers: Player[] = [];
    currentStatistic: Game = new Game();
    moneyballQueue: Moneyball[] = [];
    moneyballEnabled: boolean = false;
    pointValueList: number[] = []

    settingsVisible: boolean = true;

    gameMode: GameModeState = new OneVsOneGameModeState(this.gameService);

    selectedPlayersSubscription: Subscription = new Subscription();
    currentStatisticSubscription: Subscription = new Subscription();
    gameModeSubscription: Subscription = new Subscription()
    moneyBallQueueSubscription: Subscription = new Subscription();
    pointValueListSubscription: Subscription = new Subscription();


  
    constructor(private gameService: GameService, private configurationService: ConfigurationService, private router: Router) {
    }

    ngOnInit() {
      this.subscribeToSelectedPlayers();
      this.subscribeToCurrentGame();
      this.subscribeToGameMode();
      this.subscribeToMoneyballQueue();
      this.subscribeToPointValueList();
    }

  subscribeToPointValueList() {
    this.pointValueListSubscription = this.configurationService.pointValueList$.subscribe(pointValueList => {
      this.pointValueList = pointValueList
    });
  }

    subscribeToSelectedPlayers(){
      this.selectedPlayersSubscription = this.gameService.selectedPlayers$.subscribe(playerOne => {
        this.selectedPlayers = playerOne;
      })
    }

    subscribeToCurrentGame(){
      this.currentStatisticSubscription = this.gameService.currentGame$.subscribe(currentStatistic => {
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
      this.selectedPlayersSubscription.unsubscribe();
      this.pointValueListSubscription.unsubscribe();
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

    toggleSettings(){
      this.settingsVisible = !this.settingsVisible;
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


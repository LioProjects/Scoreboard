
import { Component } from '@angular/core';
import { PlayerGamePoint } from '../../models/player-game-point/player-game-point.model';
import { Player } from '../../models/player/player.model';
import { PlayerSelectorComponent } from "../player-selector/player-selector.component";
import { ScoreboardGraphComponent } from "../scoreboard-graph/scoreboard-graph.component";
import { ScoreboardPointButtonComponent } from '../scoreboard-point-button/scoreboard-point-button.component';

@Component({
    selector: 'app-scoreboard',
    standalone: true,
    templateUrl: './scoreboard.component.html',
    styleUrl: './scoreboard.component.scss',
    imports: [ScoreboardPointButtonComponent, PlayerSelectorComponent, ScoreboardGraphComponent]
})
export class ScoreboardComponent {

    player1: Player | undefined;
    player2: Player | undefined;
    gameMode: string = "1v1";

    gamePoints: PlayerGamePoint[] = [];

    onPlayer1Change(player: Player) {
        this.player1 = player;
      }
    
      onPlayer2Change(player: Player) {
        this.player2 = player;
      }

    undo() {
        this.gamePoints.pop();
    }
    
    resetGame () {
        this.gamePoints = [];
    }
    
    saveGame() {
        console.log("save Game to be implemented");
    }

    getAvgPlayerScore(player: Player | undefined): number{
        if (!player){
            return 0;
        }
        const playerShotsTaken = this.getPlayerShotsTaken(player);
        if (playerShotsTaken === 0) {
            return 0;
        }
        return Number((this.getPlayerScore(player)/playerShotsTaken).toFixed(2));
    }

    getPlayerScore (player: Player | undefined): number{
        if (!player){
            return 0;
        }
        return this.gamePoints.filter(x => x.player === player).map(x => x.pointValue).reduce((total, currentValue) => total + currentValue, 0);
    }

    getPlayerShotsTaken(player: Player | undefined): number{
        if (!player){
            return 0;
        }
        return this.gamePoints.filter(x => x.player === player).length
    }
}

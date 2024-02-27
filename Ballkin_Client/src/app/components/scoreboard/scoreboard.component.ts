
import { Component } from '@angular/core';
import { PlayerGamePoint } from '../../models/player-game-point/player-game-point.model';
import { Player } from '../../models/player/player.model';
import { PlayerSelectorComponent } from "../player-selector/player-selector.component";
import { ScoreboardPointButtonComponent } from '../scoreboard-point-button/scoreboard-point-button.component';

@Component({
    selector: 'app-scoreboard',
    standalone: true,
    templateUrl: './scoreboard.component.html',
    styleUrl: './scoreboard.component.scss',
    imports: [ScoreboardPointButtonComponent, PlayerSelectorComponent]
})
export class ScoreboardComponent {

    player1: Player = { id: -1, name: 'Select Player'};
    player2: Player = { id: -1, name: 'Select Player'};

    gamePoints: PlayerGamePoint[] = [];

    undo() {
        this.gamePoints.pop();
    }
    
    resetGame () {
        this.gamePoints = [];
    }
    
    saveGame() {
        console.log("save Game to be implemented");
    }

    getAvgPlayerScore(player: Player): number{
        if (!player){
            return 0;
        }
        const playerShotsTaken = this.getPlayerShotsTaken(player);
        if (playerShotsTaken === 0) {
            return 0;
        }
        return Number((this.getPlayerScore(player)/playerShotsTaken).toFixed(2));
    }

    getPlayerScore (player: Player): number{
        if (!player){
            return 0;
        }
        return this.gamePoints.filter(x => x.player === player).map(x => x.pointValue).reduce((total, currentValue) => total + currentValue, 0);
    }

    getPlayerShotsTaken(player: Player): number{
        if (!player){
            return 0;
        }
        return this.gamePoints.filter(x => x.player === player).length
    }
}

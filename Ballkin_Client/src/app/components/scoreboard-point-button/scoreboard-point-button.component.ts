import { Component, Input } from '@angular/core';
import { PlayerGamePoint } from '../../models/player-game-point/player-game-point.model';
import { Player } from '../../models/player/player.model';

@Component({
  selector: 'app-scoreboard-point-button',
  standalone: true,
  imports: [],
  templateUrl: './scoreboard-point-button.component.html',
  styleUrl: './scoreboard-point-button.component.scss'
})
export class ScoreboardPointButtonComponent {
  @Input() pointValue!: number;
  @Input() player!: Player;
  @Input() gamePoints!: PlayerGamePoint[];

  onPointButtonClick(){
    this.gamePoints.push(new PlayerGamePoint(this.player, this.pointValue))
    console.log("Player is " + this.player.name + " who scored " + this.pointValue + " " + this.gamePoints);
  }

  calculatePointValuePercentage(): number {
    const shotCount = this.gamePoints
    .filter(x => x.player === this.player).length;
    
    if (shotCount === 0){
      return 0;
    }
    const pointValueHitPercentage = this.gamePoints
        .filter(x => x.player === this.player)
        .map(x => x.pointValue)
        .filter(x => x === this.pointValue)
        .length/shotCount

    return Number((pointValueHitPercentage * 100).toFixed(0));
  }
}

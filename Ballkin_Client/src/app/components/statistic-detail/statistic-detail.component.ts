import { Component, Input } from '@angular/core';
import { Game } from '../../models/game/game.model';
import { PlayerStatistic } from '../../models/player-statistic.model';
import { StatisticCardComponent } from '../statistic-card/statistic-card.component';
import { PlayerService } from '../../services/player/player.service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ScoreboardGraphComponent } from '../scoreboard-graph/scoreboard-graph.component';

@Component({
  selector: 'app-statistic-detail',
  standalone: true,
  imports: [CommonModule, StatisticCardComponent, ScoreboardGraphComponent],
  templateUrl: './statistic-detail.component.html',
  styleUrl: './statistic-detail.component.scss'
})
export class StatisticDetailComponent {
  @Input() statisticInDetail!: Game;

  constructor(private playerService: PlayerService){}

  //todo: find a better solution because this method is 1 to 1 in the overview
  playerNameRecon(playerId: number | undefined): Observable<string>{
    if (!playerId){
      return of("playerId is undefined ")
    }
    return this.playerService.getPlayerNameById(playerId);
  }
}

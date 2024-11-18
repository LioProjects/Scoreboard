import { Component, Input} from '@angular/core';
import { Game } from '../../models/game/game.model';
import { CommonModule } from '@angular/common';
import { StatisticDetailComponent } from '../statistic-detail/statistic-detail.component';
import { PlayerStatistic } from '../../models/player-statistic.model';
import { Player } from '../../models/player/player.model';

@Component({
  selector: 'app-statistics-overview',
  standalone: true,
  imports: [CommonModule, StatisticDetailComponent],
  templateUrl: './statistics-overview.component.html',
  styleUrl: './statistics-overview.component.scss'
})

export class StatisticsOverviewComponent {
  @Input() playerList: Player[] = [];
  @Input() statistics: Game[] | PlayerStatistic[] | null = null;
  
  detailedStatistic: Game | PlayerStatistic | null = null;

  get gameStatistics(): Game[] | null {
    if (this.statistics && this.statistics[0] instanceof Game) {
      return this.statistics as Game[];
    }
    return null;
  }

  get playerStatistics(): PlayerStatistic[] | null {
    if (this.statistics && this.statistics[0] instanceof PlayerStatistic) {
      return this.statistics as PlayerStatistic[];
    }
    return null;
  }

  //NiceToKnow: Since this method is being passed to the child it needs to be an arrow function for it to not lose the "this." conntext.
  getPlayerNameById = (id: number) =>{
    return this.playerList.find(player => player._id === id)?.name ?? "Player Not Found"
  }

  setDetailedStatistic(statistic: Game | PlayerStatistic) {
    this.detailedStatistic = statistic;
  }
}

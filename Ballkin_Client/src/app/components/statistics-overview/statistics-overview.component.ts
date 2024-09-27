import { Component, Input } from '@angular/core';
import { Game } from '../../models/game/game.model';
import { CommonModule } from '@angular/common';
import { Statistic } from '../../models/statistic/statistic.model';
import { StatisticService } from '../../services/statistic/statistic.service';

@Component({
  selector: 'app-statistics-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistics-overview.component.html',
  styleUrl: './statistics-overview.component.scss'
})
export class StatisticsOverviewComponent {
  gameStatistics: Game[] | null = null;
  detailedStatistic: Game | null  = null;
  
  testStatistics: number[] = [1,2,3,4,5,6,7];

  constructor(private statisticService: StatisticService){}

  async ngOnInit() {
    try {
      this.gameStatistics = await this.statisticService.getGames();
      console.log(this.gameStatistics)
    } catch (error) {
      console.error('Error loading game statistics:', error);
    }
  }

  showDetails(statistic: any) {
    this.detailedStatistic = statistic;
  }
}

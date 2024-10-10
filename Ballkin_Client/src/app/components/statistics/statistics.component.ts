import { Component } from '@angular/core';
import { StatisticsOverviewComponent } from '../statistics-overview/statistics-overview.component';
import { PlayerStatistic } from '../../models/player-statistic.model';
import { Game } from '../../models/game/game.model';
import { Player } from '../../models/player/player.model';
import { GameApiService } from '../../services/api/game.api.service';
import { PlayerService } from '../../services/player/player.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule, StatisticsOverviewComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {
  selectedStatisticType: 'gameStatistics' | 'playerStatistics' = 'gameStatistics';
  playerList: Player[] = [];
  gameStatistics: Game[] = [];
  playerStatistics: PlayerStatistic[] = [];

  constructor(private gameApiService: GameApiService, private playerService: PlayerService, private router: Router){}

  async ngOnInit(){
    try {
      this.playerList = await this.playerService.getPlayers();
      this.gameStatistics = await this.gameApiService.getGames();
      this.playerStatistics = await this.gameApiService.getPlayerStatistics();
    } catch (error) {
      console.error('Error loading game statistics:', error);
    }
  }

  routeToScoreboard(){
    this.router.navigate(['/'])
  }

}

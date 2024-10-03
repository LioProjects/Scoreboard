import { Component} from '@angular/core';
import { Game } from '../../models/game/game.model';
import { CommonModule } from '@angular/common';
import { StatisticDetailComponent } from '../statistic-detail/statistic-detail.component';
import { Observable, of } from 'rxjs';
import { PlayerService } from '../../services/player/player.service';
import { GameApiService } from '../../services/api/game.api.service';

@Component({
  selector: 'app-statistics-overview',
  standalone: true,
  imports: [CommonModule, StatisticDetailComponent],
  templateUrl: './statistics-overview.component.html',
  styleUrl: './statistics-overview.component.scss'
})
export class StatisticsOverviewComponent {
  gameStatistics: Game[] | null = null;
  detailedStatistic: Game | null  = null;  

  constructor(private gameApiService: GameApiService, private playerService: PlayerService){}

  async ngOnInit() {
    try {
      this.gameStatistics = await this.gameApiService.getGames();
      console.log(this.gameStatistics)
    } catch (error) {
      console.error('Error loading game statistics:', error);
    }
  }

//Todo: check if i need the undefined type (i need undefined because if there is a game with only one player the second player is not defined)
  playerNameRecon(playerId: number | undefined): Observable<string>{
    if (!playerId){
      return of("playerId is undefined ")
    }
    return this.playerService.getPlayerNameById(playerId);
  }

  showDetails(statistic: any) {
    this.detailedStatistic = statistic;
  }
}

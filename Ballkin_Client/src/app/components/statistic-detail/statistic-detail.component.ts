import { Component, Input, SimpleChanges } from '@angular/core';
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
  @Input() statisticInDetail: Game | PlayerStatistic | null = null;
  @Input() getPlayerNameById!: (id: number) => string;
  statsToShow: {playerName: string, statArray: {statisticName: string, statisticValue: any}[]}[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['statisticInDetail']) {
      this.statsToShow = [];
      this.prepareStats();
    }
  }

  get gameStatistic(): Game | null {
    if (this.statisticInDetail && this.statisticInDetail instanceof Game) {
      return this.statisticInDetail as Game;
    }
    return null;
  }

  get playerStatistic(): PlayerStatistic | null {
    if (this.statisticInDetail && this.statisticInDetail instanceof PlayerStatistic) {
      return this.statisticInDetail as PlayerStatistic;
    }
    return null;
  }

  prepareStats() {
    if (this.statisticInDetail instanceof Game){
      this.statisticInDetail.playerStatistics.forEach(statistic => {
        this.statsToShow.push(
          {playerName: this.getPlayerNameById(statistic.playerId),
            statArray: [
              {
                statisticName: 'BruttoScore', statisticValue: statistic.bruttoScore
              },
              {
                statisticName: 'Ø P/S', statisticValue: statistic.avgBruttoScore
              },
              {
                statisticName: 'Point Distribution %', statisticValue: statistic.avgPointValueScored
              }            
            ]
          }
        )
      })
    } 
    else if (this.statisticInDetail instanceof PlayerStatistic){
      this.statsToShow.push(
        {
          playerName:this.getPlayerNameById(this.statisticInDetail.playerId),
          statArray: [
            {
              statisticName: 'Total Score', statisticValue: this.statisticInDetail.totalBruttoScore
            },
            {
              statisticName: 'Time Played', statisticValue: 10
            },
            {
              statisticName: 'Games Played', statisticValue: this.statisticInDetail.numberOfGamesPlayed
            },
            {
              statisticName: 'Win %', statisticValue: this.statisticInDetail.winPercentage
            },
            {
              statisticName: 'Point Distribution %', statisticValue: this.statisticInDetail.avgPointValueScored
            }
          ]
        }
      )
    }
  }
}
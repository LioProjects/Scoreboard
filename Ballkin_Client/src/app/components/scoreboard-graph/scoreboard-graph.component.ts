import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexStroke,
  ApexTitleSubtitle,
  ApexXAxis,
  ChartComponent,
  NgApexchartsModule
} from 'ng-apexcharts';
import { Game } from '../../models/game/game.model';
import { PlayerService } from '../../services/player/player.service';
import { forkJoin, map, Observable } from 'rxjs';
import { Statistic } from '../../models/statistic/statistic.model';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-scoreboard-graph',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './scoreboard-graph.component.html',
  styleUrl: './scoreboard-graph.component.scss'
})
export class ScoreboardGraphComponent implements OnChanges{
  //Todo: input if gameEnded show whole graph and not only 12 in the x axis
  @Input() currentStatistic: Game = new Game();

  @ViewChild("chart") chart?: ChartComponent;

  public chartOptions!: Partial<ChartOptions> | any;

  constructor(private playerService: PlayerService) {
    this.initializeChartOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChart()
  }

  private initializeChartOptions() {
    this.chartOptions = {
      series: [
        {
          data: []
        },
        {
          data: []
        }
      ],
      chart: {        
        height: '100%', 
        width: "100%",
        toolbar: {
          show: false,
        },
        type: "line",
        zoom: {
          enabled: true,
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      //Todo: I Think yaxis and xaxis property doesnt work      
      yaxis:{
        show: false,
        labels:{
          show: false,
        },
      },
      xaxis: {
        show: false,
      },
    };
  }

  private updateChart(): void {
    if (!this.currentStatistic?.playerStatistics?.length) {
      this.resetChartSeries();
      return;
    }

    const observables = this.currentStatistic.playerStatistics.map(statistic =>
      this.mapToChartData(statistic)
    );

    forkJoin(observables).subscribe(seriesData => {
      this.chartOptions.series = seriesData;
      this.chartOptions.yaxis.max = this.chartMinClipOff();
    });
  }

  private resetChartSeries(): void {
    this.chartOptions.series = [{ data: [] }, { data: [] }];
  }

  private async mapToChartData(statistic: Statistic): Promise<{ name: string; data: number[] }> {
    try {
      const playerName = await this.playerService.getPlayerNameById(statistic.playerId);
      return {
        name: playerName || 'Unknown',
        data: statistic.additiveScore
      };
    } catch (error) {
      console.error('Error fetching player name:', error);
      return {
        name: 'Unknown',
        data: statistic.additiveScore
      };
    }
  }

  private determineChartHeight(): number {
    // Get the parent element with the class "scoreboard-center"
    const scoreboardCenter = document.getElementsByClassName("scoreboard-center")[0];
    
    // Check if the element exists
    if (scoreboardCenter) {
      // Get the height of the parent element
      const height = scoreboardCenter.clientHeight;
      
      // You may want to log or use the height here
      console.log("Height of .scoreboard-center:", height);
      
      // Return the height
      return height;
    } else {
      // Return a default height or handle the case where the element is not found
      return 0;
    }
  }

  private chartMinClipOff (){
    let maxNettoScore = -Infinity;

    this.currentStatistic.playerStatistics.forEach(statistic =>{
      if (statistic.nettoScore > maxNettoScore){
        maxNettoScore = statistic.nettoScore;
      }
    });
    
    if (maxNettoScore <= 50){
      return 0;
    }
    else{
      return  maxNettoScore-50;
    } 
  }
}

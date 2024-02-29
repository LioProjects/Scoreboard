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
import { PlayerGamePoint } from '../../models/player-game-point/player-game-point.model';
import { Player } from '../../models/player/player.model';

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
export class ScoreboardGraphComponent implements OnChanges {
  @Input() gamePoints!: PlayerGamePoint[];
  @Input() player1!: Player | undefined;
  @Input() player2!: Player | undefined;
  @Input() gameMode!: string;
  @ViewChild("chart") chart?: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;

  constructor() {
    this.initializeChartOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['gamePoints']) {
      this.updateChart();
    }
  }

  private initializeChartOptions() {
    this.chartOptions = {
      series: [
        {
          name: this.player1?.name,
          data: [0]
        },
        {
          name: this.player2?.name,
          data: [0]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: true
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
      xaxis: {
        categories: Array.from({ length: 1000 + 1 }, (_, index) => index)
      }
    };
  }

  private updateChart() {
    this.chartOptions.series = [
      {
        name: this.player1?.name,
        data: this.getPlayerAdditiveScore(this.player1)
      },
      {
        name: this.player2?.name,
        data: this.getPlayerAdditiveScore(this.player2)
      }
    ];
    this.chartOptions.title = {
      text: this.gameMode,
      align: "center"
    }
  }

  private getXaxisLabels(): number[]{
    const shotsCountPlayer1 = this.gamePoints.filter(x => x.player === this.player1).length;
    const shotsCountPlayer2 = this.gamePoints.filter(x => x.player === this.player2).length;
    const maxLength = Math.max(shotsCountPlayer1, shotsCountPlayer2);
    const xAxisArray = Array.from({ length: maxLength + 1 }, (_, index) => index);
    return xAxisArray;
  
  }

  private getPlayerAdditiveScore(player: Player | undefined): number[] {
    if (!player) {
      return [0];
    }
    let sum = 0;
    const playerPoints = this.gamePoints
      .filter(x => x.player === player)
      .map(x => x.pointValue)
      .map(x => {
        sum = sum + x;
        return sum;
      });
  
    return [0, ...playerPoints];
  }
}

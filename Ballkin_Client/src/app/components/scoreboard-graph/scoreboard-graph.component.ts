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
import { Player } from '../../models/player/player.model';
import { GameService } from '../../services/game/game.service';

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
  @Input() player1!: Player | undefined;
  @Input() player2!: Player | undefined;
  @Input() gameMode!: string;
  @ViewChild("chart") chart?: ChartComponent;
  public chartOptions!: Partial<ChartOptions> | any;

  constructor(private gameService: GameService) {
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
          enabled: true,
        }
      },
      title: {
        text: "1v1",
        align: "left"
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
        categories: Array.from({ length: 1000 }, (_, index) => index),
        range: 15
      },
      //Todo: adjust y axis to the visible graph so that the lowest value of the graph is on the bottom and the highest is on the top
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

  }

  private getPlayerAdditiveScore(player: Player | undefined): number[] {
    //if (!player) {
    //  return [0];
    //}
    //let sum = 0;
    //const playerPoints = this.gamePoints
    //  .filter(x => x.player === player)
    //  .map(x => x.pointValue * (x.moneyball?.multiplierForShooter ?? 1))
    //  .map(x => {
    //    sum = sum + x;
    //    return sum;
    //  });
  //
    //return [0, ...playerPoints];
    return [0]
  }
}

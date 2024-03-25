import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Subscription } from 'rxjs';
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
export class ScoreboardGraphComponent implements OnInit, OnDestroy{
  @Input() player1!: Player | undefined;
  @Input() player2!: Player | undefined;
  @Input() gameMode!: string;
  @ViewChild("chart") chart?: ChartComponent;

  private playerOneAdditiveScore: number[] = [0];
  private playerTwoAdditiveScore: number[] = [0];


  private playerOneAdditiveScoreSubscription = new Subscription();
  private playerTwoAdditiveScoreSubscription = new Subscription();

  public chartOptions!: Partial<ChartOptions> | any;

  constructor(private gameService: GameService) {
    this.initializeChartOptions();
  }

  ngOnInit(): void {
    this.playerOneAdditiveScoreSubscription = this.gameService.playerOneAdditiveGamePoints$.subscribe(additiveGamePoints =>{
      this.playerOneAdditiveScore = additiveGamePoints
      this.updateChart()
    })
    this.playerTwoAdditiveScoreSubscription = this.gameService.playerTwoAdditiveGamePoints$.subscribe(additiveGamePoints =>{
      this.playerTwoAdditiveScore = additiveGamePoints
      this.updateChart()
    })
  }

  ngOnDestroy(): void {
    this.playerOneAdditiveScoreSubscription.unsubscribe();
    this.playerTwoAdditiveScoreSubscription.unsubscribe();
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
      },
      //Todo: adjust y axis to the visible graph so that the lowest value of the graph is on the bottom and the highest is on the top
    };
  }

  private updateChart() {
    console.log("chartupdated")
    this.chartOptions.series = [
      {
        name: this.player1?.name,
        data: this.playerOneAdditiveScore
      },
      {
        name: this.player2?.name,
        data: this.playerTwoAdditiveScore
      }
    ];

  }
}

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
  //maybe can ommit the player
  @Input() player1!: Player | undefined;
  @Input() player2!: Player | undefined;

  @Input() currentStatistic: Map<Player, Statistic> = new Map();

  @ViewChild("chart") chart?: ChartComponent;

  public chartOptions!: Partial<ChartOptions> | any;

  constructor() {
    this.initializeChartOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChart()
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
      yaxis:{
        range: 5
      },
      xaxis: {
        categories: Array.from({ length: 1000 }, (_, index) => index),
        range: 12
      },

      //responsive: [
      //  {
      //    breakpoint: 1000,
      //    options: {
      //      xaxis: {
      //        range: 10
      //      },
      //      
      //    }
      //  }
      //]
      //Todo: adjust y axis to the visible graph so that the lowest value of the graph is on the bottom and the highest is on the top
    };
  }

  private updateChart() {
    const seriesData: { name: string; data: number[]; }[] = [];

    this.currentStatistic.forEach((statistic, player) => {
      seriesData.push({
        name: player.name,
        data: statistic.additiveScore
      })
    })

    //this.chartOptions.chart = {height: this.determineChartHeight() * 0.75}

    this.chartOptions.series = seriesData;
    this.chartOptions.yaxis.max = this.chartMinClipOff();
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

    this.currentStatistic.forEach((stat, player) =>{
      if (stat.nettoScore > maxNettoScore){
        maxNettoScore = stat.nettoScore;
      }
    });
    
    if (maxNettoScore <= 50){
      console.log("default", 0);
      return 0;
    }
    else{
      console.log(maxNettoScore-50)
      return  maxNettoScore-50;
    } 
  }
}

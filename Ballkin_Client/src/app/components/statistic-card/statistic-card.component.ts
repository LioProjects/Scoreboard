import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-statistic-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './statistic-card.component.html',
  styleUrl: './statistic-card.component.scss'
})
export class StatisticCardComponent {
  @Input() shotsTaken: number = 0;
  @Input() bruttoScore: number = 0;
  @Input() statisticName!: string;
  @Input() statisticValue: number = 0;
  @Input() statisticValueArray: number[] = []

  getColor(index: number): string {
    const b = Math.floor(this.pointParticipation(index)*100 + 156);
    const g = Math.floor(156);
    const r = Math.floor(156);
    return `rgb(${r}, ${g}, ${b})`;
  }

  pointParticipation(pointValue: number): number{
    if (this.shotsTaken > 0 && this.bruttoScore){
      return (this.shotsTaken * this.statisticValueArray[pointValue]* pointValue/100)/this.bruttoScore;
    }
    return 0;
  }

  round(number: number): number{
    return Math.round(number);
  }
}

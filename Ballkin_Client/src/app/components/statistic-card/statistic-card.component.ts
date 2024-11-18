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
  @Input() statisticName: string = '';
  @Input() statisticValue: any = 0;

  getColor(index: number): string {
    const b = Math.floor(index + 156);
    const g = Math.floor(156);
    const r = Math.floor(156);
    return `rgb(${r}, ${g}, ${b})`;
  }


  round(number: number): number{
    if (!number){
      return 0;
    }
    return Math.round(number);
  }
}

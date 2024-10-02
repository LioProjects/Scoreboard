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
  @Input() statisticName!: string;
  @Input() statisticValue: number = 0;
  @Input() statisticValueArray: number[] = []

  getColor(index: number): string {
    const g = Math.floor(index + 156);
    const b = Math.floor(0.4 * 256);
    const r = Math.floor(0.4 * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }
}

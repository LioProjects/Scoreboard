import { Component } from '@angular/core';
import { StatisticsOverviewComponent } from '../statistics-overview/statistics-overview.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [StatisticsOverviewComponent],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.scss'
})
export class StatisticsComponent {

}

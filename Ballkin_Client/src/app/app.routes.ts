import { Routes } from '@angular/router';
import { ScoreboardComponent } from './components/scoreboard/scoreboard.component';
import { combineLatest } from 'rxjs';
import { StatisticsComponent } from './components/statistics/statistics.component';

export const routes: Routes = [
    { path: '', component: ScoreboardComponent},
    { path: 'statistics', component: StatisticsComponent    }
];

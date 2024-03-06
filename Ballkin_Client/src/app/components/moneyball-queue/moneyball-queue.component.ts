import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Moneyball } from '../../models/moneyball/moneyball.model';
import { MoneyballComponent } from "../moneyball/moneyball/moneyball.component";

@Component({
    selector: 'app-moneyball-queue',
    standalone: true,
    templateUrl: './moneyball-queue.component.html',
    styleUrl: './moneyball-queue.component.scss',
    imports: [CommonModule, FormsModule, MoneyballComponent]
})
export class MoneyballQueueComponent{
    @Input() moneyballQueue!: Moneyball[];
}

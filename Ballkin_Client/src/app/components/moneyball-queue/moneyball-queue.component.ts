import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MoneyballNormalComponent } from "../../../assets/icons/moneyball-normal/moneyball-normal.component";
import { Moneyball } from '../../models/moneyball/moneyball.model';

@Component({
    selector: 'app-moneyball-queue',
    standalone: true,
    templateUrl: './moneyball-queue.component.html',
    styleUrl: './moneyball-queue.component.scss',
    imports: [MoneyballNormalComponent, CommonModule, FormsModule]
})
export class MoneyballQueueComponent {
    @Input() moneyballQueue!: Moneyball[];
    //todo import assetservice. with that the correct moneyball can be displayed

}

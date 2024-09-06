import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Moneyball } from '../../models/moneyball/moneyball.model';
import { Player } from '../../models/player/player.model';
import { Statistic } from '../../models/statistic/statistic.model';
import { MoneyballComponent } from "../moneyball/moneyball/moneyball.component";

@Component({
    selector: 'app-moneyball-queue',
    standalone: true,
    templateUrl: './moneyball-queue.component.html',
    styleUrl: './moneyball-queue.component.scss',
    imports: [CommonModule, FormsModule, MoneyballComponent]
})
export class MoneyballQueueComponent implements AfterViewInit, OnChanges {
    @Input() moneyballQueue!: Moneyball[];
    @Input() currentStatistic!: Map<Player, Statistic>


    ngOnChanges(changes: SimpleChanges) {
        this.calculatePercentWidth();        
        if (this.detectUndone(changes['currentStatistic'].currentValue, changes['currentStatistic'].previousValue)){
            this.animateSlideLeft();
        }
        else{
            this.animateSlideRight();
        }
    }

    //detect comparing the shotstaken of everyplayer. if one is less than the previous its a undone
    detectUndone(currentStatistic: Map<Player, Statistic>, previousStatistic: Map<Player, Statistic>): boolean {
        let undoneDetected = false;
        currentStatistic.forEach((playerStatistic, player) => {
            if (!previousStatistic.has(player) || playerStatistic.shotsTaken < previousStatistic.get(player)!.shotsTaken){
                undoneDetected = true;
            } 
        })
        return undoneDetected;
    }

    ngAfterViewInit() {
        this.calculatePercentWidth();
    }

    private calculatePercentWidth(): number {
        if (!document.querySelector('.image-container')){
            return 100;
        }
        const imageContainerWidth = document.querySelector('.image-container')!.clientWidth;
        const moneyballQueueContainerWidth = document.querySelector('.moneyball-queue-container')!.clientWidth
        return (imageContainerWidth / moneyballQueueContainerWidth) * 100;
    }

    animateSlideRight(){
        const moneyballQueueElement = document.querySelector('.moneyball-queue');
        if (moneyballQueueElement){
            moneyballQueueElement.animate(
                [
                  // keyframes
                  { transform: `translateX(-${this.calculatePercentWidth()}%)` },
                  { transform: "translateX(0%)" },
                ],
                {
                  // timing options
                  duration: 500,
                },
              );
        }
    }
    animateSlideLeft(){
        const moneyballQueueElement = document.querySelector('.moneyball-queue');
        if (moneyballQueueElement){
            moneyballQueueElement.animate(
                [
                  // keyframes
                  { transform: `translateX(${this.calculatePercentWidth()}%)` },
                  { transform: "translateX(0%)" },
                ],
                {
                  // timing options
                  duration: 500,
                },
              );
        }
    }

}

import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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
export class MoneyballQueueComponent implements AfterViewInit, OnChanges {
    @Input() moneyballQueue!: Moneyball[];

    ngOnChanges(changes: SimpleChanges) {
        this.calculatePercentWidth();
        console.log("ngOnChanges triggered")
        if (this.detectUndone(changes['moneyballQueue'].currentValue, changes['moneyballQueue'].previousValue)){
            this.animateSlideLeft();
        }
        else{
            this.animateSlideRight();
        }
    }

    detectUndone(currentQueue: Moneyball[], previousQueue: Moneyball[]): boolean {
        if (
            previousQueue.slice(-1)[0] === currentQueue.slice(-2)[0] &&
            previousQueue.slice(-2)[0] === currentQueue.slice(-3)[0] &&
            previousQueue.slice(-3)[0] === currentQueue.slice(-4)[0]
        ) {
            console.log("undonedetected");
            return true;
        } else {
            return false;
        }
    }

    ngAfterViewInit() {
        this.calculatePercentWidth();
    }

    private calculatePercentWidth(): number {
        console.log("calculatevue");
        const imageContainerWidth = document.querySelector('.image-container')!.clientWidth;
        const moneyballQueueContainerWidth = document.querySelector('.moneyball-queue-container')!.clientWidth;

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

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AssetService } from '../../../services/asset/asset.service';

@Component({
  selector: 'app-moneyball',
  standalone: true,
  imports: [],
  templateUrl: './moneyball.component.html',
  styleUrl: './moneyball.component.scss'
})
export class MoneyballComponent implements OnChanges {
  @Input()
  moneyballId!: number;
  imageSrc: string | undefined;

  constructor(private assetService: AssetService){}

  ngOnChanges(changes: SimpleChanges): void {
    this.imageSrc = this.assetService.getMoneyballImageById(this.moneyballId);
  }



}

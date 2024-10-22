import { Component } from '@angular/core';
import { GameService } from '../../../services/game/game.service';
import { AddPlayerComponent } from '../../add-player/add-player/add-player.component';
import { GamemodeSelectorComponent } from '../../gamemode-selector/gamemode-selector/gamemode-selector.component';
import { PlayerSelectorNewComponent } from '../../player-selector-new/player-selector-new.component';
import { PointValueSelectorComponent } from '../../point-value-selector/point-value-selector/point-value-selector.component';

@Component({
  selector: 'app-config-panel',
  standalone: true,
  imports: [AddPlayerComponent, PlayerSelectorNewComponent, GamemodeSelectorComponent, PointValueSelectorComponent],
  templateUrl: './config-panel.component.html',
  styleUrl: './config-panel.component.scss'
})
export class ConfigPanelComponent {
  forceTakeTurns: boolean = true;

  constructor(private gameService: GameService) {}

  onTakeTurnsToggle(event: Event){
    const inputElement = event.target as HTMLInputElement;
    const isChecked = inputElement.checked;
    this.forceTakeTurns = isChecked;
  }

}

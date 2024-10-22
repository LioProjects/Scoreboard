import { Component } from '@angular/core';
import { GameService } from '../../../services/game/game.service';
import { GameModeState } from '../../../interfaces/game-mode-state/game-mode-state';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OneVsOneGameModeState } from '../../../game-modes/one-vs-one-game-mode/one-vs-one-game-mode-state';

@Component({
  selector: 'app-gamemode-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gamemode-selector.component.html',
  styleUrl: './gamemode-selector.component.scss'
})
export class GamemodeSelectorComponent {

  selectedGameMode: GameModeState = new OneVsOneGameModeState(this.gameService);
  gameModeList: GameModeState[] = []
  dropdownVisible: boolean = true;

  constructor(private gameService: GameService){}
  
  ngOnInit(){
    this.gameModeList = this.gameService.getGameModes()
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  onGameModeSelect(gameMode: GameModeState, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const isChecked = inputElement.checked;
    if (isChecked){
      this.selectedGameMode = gameMode;
    }
    this.gameService.setGameMode(gameMode)
  }

  isSelected(gameMode: GameModeState): boolean{
    return this.selectedGameMode.getName() === gameMode.getName()
  }

}

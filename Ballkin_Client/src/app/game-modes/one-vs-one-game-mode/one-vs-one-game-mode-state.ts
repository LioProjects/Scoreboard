import { GameModeState } from "../../interfaces/game-mode-state/game-mode-state";
import { Moneyball } from "../../models/moneyball/moneyball.model";
import { PlayerGamePoint } from "../../models/player-game-point/player-game-point.model";
import { Player } from "../../models/player/player.model";
import { GameService } from "../../services/game/game.service";

export class OneVsOneGameModeState implements GameModeState{

    constructor(private gameService: GameService){}

    recordPlayerScore(player: Player, pointValue: number, moneyball?: Moneyball | undefined): void {
        const newGamePoint = new PlayerGamePoint(player, pointValue, moneyball);
        this.gameService.addGamePoint(newGamePoint);
    }
}

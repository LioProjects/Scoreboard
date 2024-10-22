import { GameModeState } from "../../interfaces/game-mode-state/game-mode-state";
import { Game } from "../../models/game/game.model";
import { PlayerGamePoint } from "../../models/player-game-point/player-game-point.model";
import { Player } from "../../models/player/player.model";
import { Statistic } from "../../models/statistic/statistic.model";
import { GameService } from "../../services/game/game.service";

export class OneVsOneGameModeState implements GameModeState{

    private name: string = "1 vs 1"

    constructor(private gameService: GameService){}

    recordPlayerScore(playerGamePoint: PlayerGamePoint, currentStatistic: Game): void {
        this.gameService.addGamePoint(playerGamePoint);
    }

    getName(): string {
        return this.name;
    }

}

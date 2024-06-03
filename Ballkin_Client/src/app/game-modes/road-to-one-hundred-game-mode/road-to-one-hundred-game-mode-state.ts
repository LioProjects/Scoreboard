import { GameModeState } from "../../interfaces/game-mode-state/game-mode-state";
import { PlayerGamePoint } from "../../models/player-game-point/player-game-point.model";
import { Player } from "../../models/player/player.model";
import { Statistic } from "../../models/statistic/statistic.model";
import { GameService } from "../../services/game/game.service";

export class RoadToOneHundredGameModeState implements GameModeState{

    private name: string = "Road To 100";

    constructor(private gameService: GameService){}

    recordPlayerScore(playerGamePoint: PlayerGamePoint, currentStatistic: Map<Player, Statistic>): void {
        const playerNettoScoreInProgress = (currentStatistic.get(playerGamePoint.player)?.nettoScore ?? 0) + playerGamePoint.pointValue * (playerGamePoint.moneyball?.multiplierForShooter ?? 1)
        if (playerNettoScoreInProgress >= 100 && playerGamePoint.pointValue !== 4) {
            this.gameService.setGameStatus(false)
            playerGamePoint.multiplier = 0;
            this.gameService.addGamePoint(playerGamePoint);
        } else {
            if(playerNettoScoreInProgress >= 100){
                this.gameService.setGameStatus(true);
            }
            this.gameService.addGamePoint(playerGamePoint);
        }
    }

    getName(): string {
        return this.name;
    }
}


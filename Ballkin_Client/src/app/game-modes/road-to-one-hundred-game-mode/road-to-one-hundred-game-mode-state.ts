import { GameModeState } from "../../interfaces/game-mode-state/game-mode-state";
import { Moneyball } from "../../models/moneyball/moneyball.model";
import { PlayerGamePoint } from "../../models/player-game-point/player-game-point.model";
import { Player } from "../../models/player/player.model";
import { GameService } from "../../services/game/game.service";

export class RoadToOneHundredGameModeState implements GameModeState{

    isGameEnded: boolean = false;

    constructor(private gameService: GameService){};

    recordPlayerScore(player: Player, pointValue: number, moneyball?: Moneyball | undefined): void {
        this.gameService.getPlayerScore(player).subscribe(score => {
            if (score + pointValue * (moneyball?.multiplierForShooter ?? 1) >= 100 && pointValue !== 4) {
                this.isGameEnded = false;
                const newGamePoint = new PlayerGamePoint(player, pointValue, moneyball, 0);
                this.gameService.addGamePoint(newGamePoint);
            } else {
                const newGamePoint = new PlayerGamePoint(player, pointValue, moneyball);
                if (score >= 100) {
                    this.isGameEnded = true;
                }
                this.gameService.addGamePoint(newGamePoint);
            }
        });
    }
}

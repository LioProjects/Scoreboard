import { Game } from "../../models/game/game.model";
import { PlayerGamePoint } from "../../models/player-game-point/player-game-point.model";

export interface GameModeState {
    recordPlayerScore(playerGamePoint: PlayerGamePoint, currentStatistic: Game): void;
    getName(): string;
}

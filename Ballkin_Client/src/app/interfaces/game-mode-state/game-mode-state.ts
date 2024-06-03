import { PlayerGamePoint } from "../../models/player-game-point/player-game-point.model";
import { Player } from "../../models/player/player.model";
import { Statistic } from "../../models/statistic/statistic.model";

export interface GameModeState {
    recordPlayerScore(playerGamePoint: PlayerGamePoint, currentStatistic: Map<Player, Statistic>): void;
    getName(): string;
}

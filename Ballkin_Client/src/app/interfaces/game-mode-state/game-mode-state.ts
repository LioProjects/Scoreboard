import { Moneyball } from "../../models/moneyball/moneyball.model";
import { Player } from "../../models/player/player.model";

export interface GameModeState {
    recordPlayerScore(player: Player, pointValue: number, moneyball?: Moneyball): void;
}

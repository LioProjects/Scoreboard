import { Moneyball } from "../moneyball/moneyball.model";
import { Player } from "../player/player.model";

export class PlayerGamePoint {
    player: Player;
    pointValue: number;
    moneyball?: Moneyball;
    multiplier: number;

    constructor(player: Player, pointValue: number, moneyball?: Moneyball, multiplier: number = 1){
        this.player = player;
        this.pointValue = pointValue
        this.moneyball = moneyball;
        this.multiplier = multiplier;
    }
}

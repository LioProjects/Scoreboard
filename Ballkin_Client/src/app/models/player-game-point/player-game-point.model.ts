import { Moneyball } from "../moneyball/moneyball.model";
import { Player } from "../player/player.model";

export class PlayerGamePoint {
    player: Player;
    pointValue: number;
    moneyball?: Moneyball;

    constructor(player: Player, pointValue: number, moneyball?: Moneyball){
        this.player = player;
        this.pointValue = pointValue
        this.moneyball = moneyball;
    }
}

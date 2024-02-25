import { Player } from "../player/player.model";

export class PlayerGamePoint {
    player: Player;
    pointValue: number;
    extras?: undefined;

    constructor(player: Player, pointValue: number){
        this.player = player;
        this.pointValue = pointValue
    }
}

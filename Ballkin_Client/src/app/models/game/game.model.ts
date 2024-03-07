export class Game {
    player1: number;
    player2: number;
    player1Points?: number[];
    player2Points?: number[];

    constructor(player1: number, player2: number){
        this.player1 = player1;
        this.player2 = player2;
    }
}

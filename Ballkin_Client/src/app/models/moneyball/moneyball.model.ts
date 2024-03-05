
export class Moneyball {
    id: number;
    multiplierForShooter: number;
    multiplierForOpponent: number;

    constructor(id: number, multiplierForShooter: number, multiplierForOpponent: number){
        this.id = id;
        this.multiplierForShooter = multiplierForShooter;
        this.multiplierForOpponent = multiplierForOpponent;
    }
}


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

export const MONEYBALLS: Moneyball[] = [
    new Moneyball(1, 1, 0),
    new Moneyball(2, 2, 0),
    new Moneyball(3, 3, -1),
  ];
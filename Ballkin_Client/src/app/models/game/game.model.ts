import { Statistic } from "../statistic/statistic.model";

export class Game {
    playerStatistics: Statistic[];

    constructor(playerStatistics: Statistic[]){
        this.playerStatistics = playerStatistics;
    }
}

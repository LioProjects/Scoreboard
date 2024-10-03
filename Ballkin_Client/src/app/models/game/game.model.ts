import { Statistic } from "../statistic/statistic.model";

export class Game {
    date?: Date;
    playerStatistics: Statistic[];


    constructor(playerStatistics: Statistic[] = [], date?: Date){
        this.playerStatistics = playerStatistics;
        this.date = date;
    }
}

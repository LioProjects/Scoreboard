export class PlayerStatistic {
    playerId: string;
    totalGamesPlayed: number;
    winPercentage: number;
    totalBruttoScore: number;
    avgBruttoScore: number;
    totalShotsTaken: number;
    pointValueScored: Map<number, number>;
    avgPointValueScored: Map<number, number>;

    constructor(
        playerId: string,
        totalGamesPlayed: number,
        winPercentage: number,
        totalBruttoScore: number,
        avgBruttoScore: number,
        totalShotsTaken: number,
        pointValueScored: Map<number, number>,
        avgPointValueScored: Map<number, number>
      ) {
        this.playerId = playerId;
        this.totalGamesPlayed = totalGamesPlayed;
        this.winPercentage = winPercentage;
        this.totalBruttoScore = totalBruttoScore;
        this.avgBruttoScore = avgBruttoScore;
        this.totalShotsTaken = totalShotsTaken;
        this.pointValueScored = pointValueScored;
        this.avgPointValueScored = avgPointValueScored;
      }
}

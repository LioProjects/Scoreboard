export class PlayerStatistic {
    playerId: number;
    numberOfGamesPlayed: number;
    winPercentage: number;
    totalBruttoScore: number;
    avgBruttoScore: number;
    totalShotsTaken: number;
    avgPointValueScored: number[];

    constructor(
        playerId: number,
        numberOfGamesPlayed: number,
        winPercentage: number,
        totalBruttoScore: number,
        avgBruttoScore: number,
        totalShotsTaken: number,
        avgPointValueScored: number[]
      ) {
        this.playerId = playerId;
        this.numberOfGamesPlayed = numberOfGamesPlayed;
        this.winPercentage = winPercentage;
        this.totalBruttoScore = totalBruttoScore;
        this.avgBruttoScore = avgBruttoScore;
        this.totalShotsTaken = totalShotsTaken;
        this.avgPointValueScored = avgPointValueScored;
      }
}

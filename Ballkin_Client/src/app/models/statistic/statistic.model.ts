export class Statistic {
    playerId: number;
    nettoScore: number;
    bruttoScore: number;
    shotsTaken: number;
    avgBruttoScore: number;
    pointValueScored: number[];
    avgPointValueScored: number[];
    sufferedMalus: number;
    additiveScore: number[];


constructor(
    playerId: number,
    nettoScore: number = 0,
    bruttoScore: number = 0,
    shotsTaken: number = 0,
    pointValueScored: number[] = [0, 0, 0, 0, 0],
    additiveScore = [0],
    sufferedMalus: number = 0
) {
    this.playerId = playerId;
    this.nettoScore = nettoScore;
    this.bruttoScore = bruttoScore;
    this.shotsTaken = shotsTaken;
    this.pointValueScored = pointValueScored;
    this.sufferedMalus = sufferedMalus;
    this.additiveScore = additiveScore;
    
    if (shotsTaken === 0){
        this.avgBruttoScore = 0
        this.avgPointValueScored = [0, 0, 0, 0, 0]
    }
    else {
        this.avgBruttoScore = Math.round((bruttoScore/shotsTaken) * 100) / 100;
        this.avgPointValueScored = [
            Math.round(pointValueScored[0]/shotsTaken * 1000) / 10 , 
            Math.round(pointValueScored[1]/shotsTaken * 1000) / 10, 
            Math.round(pointValueScored[2]/shotsTaken * 1000) / 10,
            Math.round(pointValueScored[3]/shotsTaken * 1000) / 10, 
            Math.round(pointValueScored[4]/shotsTaken * 1000) / 10
        ]
    }
}
}
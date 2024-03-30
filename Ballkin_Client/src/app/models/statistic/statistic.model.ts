export class Statistic {
    nettoScore: number;
    bruttoScore: number;
    shotsTaken: number;

    avgBruttoScore: number;

    pointValueScored: Map<number, number>;
    avgPointValueScored: Map<number, number>;

    sufferedMalus: number;


constructor(
    nettoScore: number = 0,
    bruttoScore: number = 0,
    shotsTaken: number = 0,
    pointValueScored: Map<number, number> = new Map([
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0]
    ]),
    sufferedMalus: number = 0
) {
    this.nettoScore = nettoScore;
    this.bruttoScore = bruttoScore;
    this.shotsTaken = shotsTaken;
    this.pointValueScored = pointValueScored;
    this.sufferedMalus = sufferedMalus;
    
    if (shotsTaken === 0){
        this.avgBruttoScore = 0
        this.avgPointValueScored = new Map([
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 0]
        ])
    }
    else {
        this.avgBruttoScore = Math.round((bruttoScore/shotsTaken) * 100) / 100;
        this.avgPointValueScored = new Map([
            [0, pointValueScored.get(0) ? 0 : Math.round((pointValueScored.get(0)! / shotsTaken) * 100)],
            [1, pointValueScored.get(1) ? 0 : Math.round((pointValueScored.get(1)! / shotsTaken) * 100)],
            [2, pointValueScored.get(2) ? 0 : Math.round((pointValueScored.get(2)! / shotsTaken) * 100)],
            [3, pointValueScored.get(3) ? 0 : Math.round((pointValueScored.get(3)! / shotsTaken) * 100)],
            [4, pointValueScored.get(4) ? 0 : Math.round((pointValueScored.get(4)! / shotsTaken) * 100)]
        ])
    }
}
}
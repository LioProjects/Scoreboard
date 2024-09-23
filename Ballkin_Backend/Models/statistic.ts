/*
import { Schema, model, connect } from 'mongoose';

interface IStatistic {
    playerId: Schema.Types.ObjectId;
    gameId: Schema.Types.ObjectId;
    nettoScore: number;
    bruttoScore: number;
    shotsTaken: number;
    avgBruttoScore: number;
    pointValueScored: Map<number, number>;
    avgPointValueScored: Map<number, number>;
    sufferedMalus: number;
    additiveScore: number[];
}

const statisticSchema = new Schema<IStatistic>({
    playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    gameId: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
    nettoScore: { type: Number, required: true},
});

const Statistic = model<IStatistic>("Statistic", statisticSchema);

export default Statistic;
*/
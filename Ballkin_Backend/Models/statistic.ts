
import { Schema, model, connect } from 'mongoose';
//todo: create service that calculates it and sends it to frontend
export interface IPlayerStatistic {
    playerId: Schema.Types.ObjectId;
    numberOfGamesPlayed: number;
    winPercentage: number;
    totalBruttoScore: number;
    avgBruttoScore: number;
    shotsTaken: number;
    avgPointValueScored: Map<number, number>;
}
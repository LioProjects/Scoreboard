
import { Schema, model, connect, Types } from 'mongoose';
//todo: create service that calculates it and sends it to frontend
export interface IPlayerStatistic {
    playerId: string;
    numberOfGamesPlayed: number;
    winPercentage: number;
    totalBruttoScore: number;
    avgBruttoScore: number;
    totalShotsTaken: number;
    avgPointValueScored: number[];
}
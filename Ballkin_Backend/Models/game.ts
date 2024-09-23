import { Schema, model, Document } from 'mongoose';

export interface IStatistic {
  playerId: string;
  nettoScore: number;
  bruttoScore: number;
  shotsTaken: number;
  avgBruttoScore: number;
  pointValueScored: { [key: number]: number };
  avgPointValueScored: { [key: number]: number };
  sufferedMalus: number;
  additiveScore: number[];
}

// Define the Statistic schema
const statisticSchema = new Schema<IStatistic>({
  playerId: { type: String, required: true },
  nettoScore: { type: Number, required: true },
  bruttoScore: { type: Number, required: true },
  shotsTaken: { type: Number, required: true },
  avgBruttoScore: { type: Number, required: true },
  pointValueScored: { type: Map, of: Number, default: {} }, 
  avgPointValueScored: { type: Map, of: Number, default: {} }, 
  sufferedMalus: { type: Number, required: true },
  additiveScore: { type: [Number], default: [] } 
});

export interface IGame extends Document {
  date?: Date;
  playerStatistics: IStatistic[]; 
}

const gameSchema = new Schema<IGame>({
  date: { type: Date, default: Date.now },
  playerStatistics: {
    type: [statisticSchema],
    required: true
  }
});

const Game = model<IGame>("Game", gameSchema);

export default Game;
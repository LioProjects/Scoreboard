import { Schema, model, Document, ObjectId } from 'mongoose';

export interface IStatistic {
  playerId: { type: Schema.Types.ObjectId, required: true }
  nettoScore: number;
  bruttoScore: number;
  shotsTaken: number;
  avgBruttoScore: number;
  pointValueScored: number[];
  avgPointValueScored: number[];
  sufferedMalus: number;
  additiveScore: number[];
}

// Define the Statistic schema
const statisticSchema = new Schema<IStatistic>({
  playerId: { type: Schema.Types.ObjectId, required: true, ref: 'Player' },
  nettoScore: { type: Number, required: true },
  bruttoScore: { type: Number, required: true },
  shotsTaken: { type: Number, required: true },
  avgBruttoScore: { type: Number, required: true },
  pointValueScored: { type: [Number], default: [0,0,0,0,0] }, 
  avgPointValueScored: { type: [Number], default: [0,0,0,0,0] }, 
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
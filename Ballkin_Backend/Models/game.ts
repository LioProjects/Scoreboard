import { Schema, model, Document } from 'mongoose';

export interface IStatistic {
  playerId: String;
  nettoScore: number;
}

const statisticSchema = new Schema<IStatistic>({
  playerId: { type: String, required: true },
  nettoScore: { type: Number, required: true },
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
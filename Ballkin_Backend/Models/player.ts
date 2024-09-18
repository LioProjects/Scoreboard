import { Schema, model } from 'mongoose';

interface IPlayer {
    name: string;
}

const playerSchema = new Schema<IPlayer>({
    name: { type: String, required: true}

});

const Player = model<IPlayer>("Player", playerSchema);
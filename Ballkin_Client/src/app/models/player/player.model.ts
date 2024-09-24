import { Game } from "../game/game.model";

//Todo change _id in backend that it is id
export class Player {
    name: string;
    _id: number;
    games?: Game[];

    constructor(id: number, name: string) {
        this.name = name;
        this._id = id;
    }
}


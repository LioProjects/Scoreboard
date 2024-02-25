import { Game } from "../game/game.model";

export class Player {
    name: string;
    id: number;
    games?: Game[];

    constructor(name: string, id: number) {
        this.name = name;
        this.id = id;
    }
}
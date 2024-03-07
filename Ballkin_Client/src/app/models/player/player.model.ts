import { Game } from "../game/game.model";

export class Player {
    name: string;
    id: number;
    games?: Game[];

    constructor(id: number, name: string) {
        this.name = name;
        this.id = id;
    }
}

export const PLAYERS: Player[] = [
    new Player(1, "Lionel"),
    new Player(2, "Nico"),
    new Player(3, "Noel"),
    new Player(4, "Johannes"),
    new Player(5, "Alec")
]

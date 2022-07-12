import { useState } from "react";
import { Img } from "types";

export class Player {
    id: string;
    name: string;
    image?: Img;
    goals: number;
    assists: number;
    games: number;

    constructor(player: Player) {
        this.id = player.id;
        this.name = player.name;
        this.goals = player.goals;
        this.assists = player.assists;
        this.games = player.games;
    }
}

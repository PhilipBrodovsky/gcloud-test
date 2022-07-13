import { DocumentSnapshot } from "firebase/firestore";
import { useState } from "react";
import { Img } from "types";

export class Player {
    readonly id: string;
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
    addGoal() {}
    removeGoal() {}

    addAssist() {}
    removeAssist() {}

    addGame() {}
    removeGame() {}
}

export const PlayerConverter = {
    toFirestore: (player: Player) => {
        return {
            name: player.name,
            image: player.image,
            goals: player.goals,
            assists: player.assists,
            games: player.games,
        };
    },
    fromFirestore: (snapshot: DocumentSnapshot, options: any) => {
        const data = snapshot.data(options) as Player;
        return new Player(data);
    },
};

export type NewPlayer = Pick<Player, "name" | "image">;

import { Teams } from "types";

export interface Game {
    id: string;
    teamOne: {
        name: string;
        players: { [key: string]: { goals: number; assists: number } };
    };
    teamTwo: {
        name: string;
        players: { [key: string]: { goals: number; assists: number } };
    };
    winner?: string;
    createDate: number;
    gameStartDate: number;
    gameEndDate: number;
    pauseStart: number;
    pauseTotal: number;
    status: "not-active" | "stopped" | "active" | "completed";
}

import { Teams } from "types";

export interface GamePlayer {
	playerId: string;
	teamId: string;
	goals: number;
	assists: number;
}
export interface Game {
	id: string;
	teams: string[];
	players: GamePlayer[];
	winner?: string;
	createDate: number;
	gameStartDate: number;
	gameEndDate: number;
	pauseStart: number;
	pauseTotal: number;
	status: "not-active" | "stopped" | "active" | "completed";
}

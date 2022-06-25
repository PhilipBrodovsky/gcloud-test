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
	gameStartDate: number;
	gameEndDate: number;
	pauses: { start: number; end: number; duration: number }[];
	status: "not-active" | "stopped" | "active" | "completed";
}

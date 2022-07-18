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
	callback: any;

	constructor(player?: Player) {
		this.id = player?.id || "";
		this.name = player?.name || "";
		this.goals = player?.goals || 0;
		this.assists = player?.assists || 0;
		this.games = player?.games || 0;

		this.addGoal = this.addGoal.bind(this);
	}
	addGoal() {
		this.goals++;
		this.callback(this.clone());
	}
	removeGoal() {}

	addAssist() {}
	removeAssist() {}

	addGame() {}
	removeGame() {}

	clone() {
		return new Player(this);
	}
}

export const usePlayer = (player?: Player) => {
	const [state, setState] = useState(new Player(player));
	state.callback = setState;
	return state;
};

export const usePlayers = (players?: Player[]) => {
	const [state, setState] = useState(players);
	return state;
};

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
		return new Player({ ...data, id: snapshot.id } as Player);
	},
};

export function calculateRank(games: number, goals: number, assists: number, wins: number) {
	if (games === 0) return 0;
	const goalsAverage = (goals / (games * 2)) * 100;
	const assistsAverage = ((assists / (games * 2)) * 100) / 2;
	const winssRank = (wins / games) * 100;
	const losePercent = 100 - winssRank;
	const goalsResult = losePercent > 0 ? goalsAverage / losePercent : 0;
	const assistsResult = losePercent > 0 ? assistsAverage / losePercent : 0;
	const totalRank = winssRank + goalsResult + assistsResult;
	console.log("-------------------------");
	console.log("winsRank", winssRank);
	console.log("assistsAverage", assistsAverage);
	console.log("goalsAverage", goalsAverage);
	console.log("totalRank", totalRank);

	return Math.min(totalRank, 100).toFixed();
}

export type NewPlayer = Pick<Player, "name" | "image">;

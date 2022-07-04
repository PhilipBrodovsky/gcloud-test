export interface Group {
	id: string;
	name: string;
	numberOfTeams: number;
	playersPerTeam: number;
	image?: {
		url: string;
		bucket: string;
		fullPath: string;
		name: string;
	};
	players: string[];
}

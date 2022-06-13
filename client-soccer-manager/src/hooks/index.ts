import { useAppSelector } from "store";

export const useCycleGames = (cycleId: string) => {
	const games = useAppSelector((state) => state.games.map[cycleId]);
	return games || [];
};

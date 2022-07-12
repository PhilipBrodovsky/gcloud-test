import { Card, CardContent, Fab, Stack, Typography } from "@mui/material";
import { AppBarWithDrawer } from "components";
import { useFirebaseApi } from "firebase-api";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActions, useAppSelector } from "store";
import AddIcon from "@mui/icons-material/Add";
import { Game } from "./Game";
import { orderBy } from "firebase/firestore";

export const GamesPage = () => {
	const { cycleId, groupId } = useParams<{ cycleId: string; groupId: string }>();

	const games = useAppSelector((state) => state.games.map[cycleId!]) as Game[];

	console.log("====================================");
	console.log("games", games);
	console.log("====================================");
	const firebaseApi = useFirebaseApi();
	const actions = useActions();

	const navigate = useNavigate();

	useEffect(() => {
		firebaseApi.firesotre.subscribeCollection({
			collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
			order: orderBy("createDate", "desc"),
			callback: (result) => {
				console.log("result", result);
				actions.dispatch(
					actions.games.set({
						cycleId: cycleId!,
						games: result.items,
					})
				);
			},
		});
	}, [cycleId]);

	if (!games) return null;

	return (
		<AppBarWithDrawer title="games">
			<Stack margin={2} sx={{ backgroundColor: "lightgray" }} gap={2}>
				{games.map((game) => {
					const goals1 = Object.values(game.teamOne.players).reduce(
						(acc, player) => (acc += player.goals),
						0
					);
					const goals2 = Object.values(game.teamTwo.players).reduce(
						(acc, player) => (acc += player.goals),
						0
					);
					return (
						<Card onClick={() => navigate(game.id)}>
							<CardContent>
								<Typography variant="h4">
									{game.teamOne.name} vs {game.teamTwo.name}
								</Typography>
								<Typography variant="h3">
									{goals1} - {goals2}
								</Typography>
							</CardContent>
						</Card>
					);
				})}
			</Stack>
			<Fab
				onClick={() => navigate(`create`)}
				color="primary"
				aria-label="add"
				sx={{
					position: "fixed",
					bottom: 16,
					right: 16,
				}}
			>
				<AddIcon />
			</Fab>
		</AppBarWithDrawer>
	);
};

import {
	Badge,
	Button,
	Card,
	CardActions,
	CardContent,
	Fab,
	Stack,
	Typography,
} from "@mui/material";
import { AppBarWithDrawer } from "components";
import { useFirebaseApi } from "firebase-api";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActions, useAppSelector } from "store";
import AddIcon from "@mui/icons-material/Add";
import { Game } from "./Game";
import { orderBy } from "firebase/firestore";

export const GamesPage = () => {
	const { cycleId, groupId } = useParams<{
		cycleId: string;
		groupId: string;
	}>();

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
		<AppBarWithDrawer
			onBack={() =>
				navigate(
					window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"))
				)
			}
			title="games"
		>
			<Stack margin={2} sx={{ backgroundColor: "lightgray" }} gap={2}>
				{games.map((game) => {
					const goals1 = game.players.reduce((acc, player) => {
						if (player.teamId === game.teams[0]) acc += player.goals || 0;
						return acc;
					}, 0);
					const goals2 = game.players.reduce((acc, player) => {
						if (player.teamId === game.teams[1]) acc += player.goals || 0;
						return acc;
					}, 0);
					const winnertTeam = game.winner;

					return (
						<Card
							sx={{
								background: game.status === "active" ? "lightgreen" : undefined,
							}}
						>
							<CardContent onClick={() => navigate(game.id)}>
								<Typography textAlign={"end"} variant="caption">
									{game.status}
								</Typography>
								<Stack
									alignItems={"center"}
									width={"100%"}
									direction={"row"}
									justifyContent={"space-between"}
								>
									<Typography
										color={game.teams[0] === winnertTeam ? "primary" : undefined}
										variant="h4"
									>
										{game.teams[0]}
									</Typography>
									<Typography> vs</Typography>
									<Typography
										color={game.teams[1] === winnertTeam ? "primary" : undefined}
										variant="h4"
									>
										{game.teams[1]}
									</Typography>
								</Stack>
								<Typography variant="h3">
									{goals1} - {goals2}
								</Typography>
							</CardContent>
							<CardActions>
								<Button>Remove</Button>
								<Button>edit</Button>
							</CardActions>
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

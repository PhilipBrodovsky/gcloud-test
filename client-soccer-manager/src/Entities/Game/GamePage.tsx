import { Box, Button, Card, Fab, Stack, Typography } from "@mui/material";
import { AppBarWithDrawer } from "components";
import { useFirebaseApi } from "firebase-api";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActions, useAppSelector } from "store";
import AddIcon from "@mui/icons-material/Add";
import { Game } from "./Game";
import { differenceInSeconds } from "date-fns";

export const GamePage = () => {
	const { cycleId, groupId, gameId } = useParams<{
		cycleId: string;
		groupId: string;
		gameId: string;
	}>();

	const games = useAppSelector((state) => state.games.map[cycleId!]) as Game[];

	const firebaseApi = useFirebaseApi();
	const actions = useActions();

	const navigate = useNavigate();

	const [game, setGame] = useState<Game | null>(null);
	const [date, setDate] = useState(Date.now());

	const ref = useRef();

	useEffect(() => {
		if (game?.status == "active") {
			ref.current = setInterval(() => setDate(Date.now()), 1000);
		}
		return () => {
			clearInterval(ref.current);
		};
	}, [game?.status]);

	const addGoal = (id: string) => {
		firebaseApi.firesotre.updateDocument({
			collectionName: location.pathname.split("/").slice(0, -1).join("/"),
			id: game.id,
			data: {
				[`goals.${id}`]: firebaseApi.firesotre.increment(1),
			},
		});
	};

	useEffect(() => {
		firebaseApi.firesotre.subscribeDoc({
			collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
			docId: gameId,
			callback: (result) => {
				console.log("result", result);
				setGame(result.item);
			},
		});
	}, [cycleId]);

	const startGame = () => {
		if (game?.status === "not-active") {
			firebaseApi.firesotre.updateDocument({
				collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
				id: gameId!,
				data: { gameStartDate: Date.now(), status: "active" },
			});
		}
		if (game?.status === "active") {
			firebaseApi.firesotre.updateDocument({
				collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
				id: gameId!,
				data: { status: "stopped" },
			});
		}
		if (game?.status === "stopped") {
			firebaseApi.firesotre.updateDocument({
				collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
				id: gameId!,
				data: { status: "active" },
			});
		}
	};

	const endGame = () => {
		firebaseApi.firesotre.updateDocument({
			collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
			id: gameId!,
			data: { status: "completed", gameEndDate: Date.now() },
		});
	};

	if (!game) return;

	console.table(game.status);

	console.log("====================================");
	console.log(game.status !== "active" ? "Stop" : "Play");
	console.log("====================================");

	return (
		<AppBarWithDrawer title="games">
			<Box
				sx={{
					maxWidth: "550px",
					margin: "auto",
				}}
			>
				<Box>
					<Typography textAlign="center" variant="h4">
						{game.teamOne.name} vs {game.teamTwo.name}
					</Typography>
				</Box>
				<Stack
					direction="row"
					justifyContent="space-between"
					sx={{
						border: "4px solid",
						borderRadius: 4,
						height: 250,
						padding: 4,
					}}
					gap={4}
				>
					<Stack
						sx={{
							width: "50%",
						}}
						gap={2}
					>
						<Box
							sx={{
								border: "4px solid",
								borderRadius: 4,
								height: 100,
								width: 100,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: 40,
							}}
						>
							2
						</Box>
						{[1, 2].map((i) => {
							return <Typography>player name 1</Typography>;
						})}
					</Stack>
					<Stack
						sx={{
							width: "50%",
						}}
						gap={2}
					>
						<Box
							sx={{
								border: "4px solid",
								borderRadius: 4,
								height: 100,
								width: 100,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: 40,
							}}
						>
							2
						</Box>
						{[1, 2].map((i) => {
							return <Typography>player name 1</Typography>;
						})}
					</Stack>
				</Stack>
				<Stack my={2} direction={"row"} justifyContent="space-between">
					<Button
						variant="contained"
						onClick={startGame}
						disabled={game.status === "completed"}
					>
						{game.status === "active" ? "Stop" : "Play"}
					</Button>
					<Typography variant="h5">
						{displayTimer(differenceInSeconds(new Date(date), new Date(game.gameStartDate)))}
					</Typography>
					<Button variant="contained" onClick={endGame} disabled={game.status === "completed"}>
						end
					</Button>
				</Stack>
			</Box>
		</AppBarWithDrawer>
	);
};

function displayTimer(time: number) {
	console.log("====================================");
	console.log("time", time);
	console.log("====================================");
	const seconds = time % 60;
	const minutes = (time / 60) ^ 0;
	return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

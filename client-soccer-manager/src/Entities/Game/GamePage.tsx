import {
	Badge,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Fab,
	IconButton,
	Stack,
	Typography,
} from "@mui/material";
import { AppBarWithDrawer } from "components";
import { useFirebaseApi } from "firebase-api";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActions, useAppSelector } from "store";
import AddIcon from "@mui/icons-material/Add";
import { Game } from "./Game";
import { differenceInSeconds } from "date-fns";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import HdrAutoIcon from "@mui/icons-material/HdrAuto";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { Player } from "Entities/Player";

export const GamePage = () => {
	const { cycleId, groupId, gameId } = useParams<{
		cycleId: string;
		groupId: string;
		gameId: string;
	}>();

	const firebaseApi = useFirebaseApi();
	const actions = useActions();

	const navigate = useNavigate();

	const [game, setGame] = useState<Game | null>(null);
	const [date, setDate] = useState(Date.now());

	const ref = useRef<NodeJS.Timer>();

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
		if (!gameId) return;
		const unsubscribe = firebaseApi.firesotre.subscribeDoc({
			collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
			docId: gameId,
			callback: (result) => {
				console.log("result", result);
				setGame(result.item);
			},
		});
		return unsubscribe;
	}, [cycleId]);

	const startGame = () => {
		if (game?.status === "not-active" || !game?.status) {
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

	if (!game) return null;

	return (
		<AppBarWithDrawer title="games">
			<Card
				sx={{
					maxWidth: "550px",
					margin: "auto",
					width: "100%",
				}}
			>
				<CardHeader title="group header" />
				<Box>
					<Typography textAlign="center" variant="h4">
						{game.teamOne.name} vs {game.teamTwo.name}
					</Typography>
				</Box>
				<Stack
					direction="row"
					justifyContent="space-between"
					sx={{
						borderRadius: 4,
						padding: 4,
					}}
					gap={2}
				>
					<RenderTeam teamNumber="teamOne" game={game} team={game.teamOne} />
					<RenderTeam teamNumber="teamTwo" game={game} team={game.teamTwo} />
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
						{displayTimer(
							differenceInSeconds(new Date(date), new Date(game.gameStartDate || date))
						)}
					</Typography>
					<Button variant="contained" onClick={endGame} disabled={game.status === "completed"}>
						end
					</Button>
				</Stack>
			</Card>
		</AppBarWithDrawer>
	);
};

function RenderTeam(props: {
	team: { name: string; players: { [key: string]: { goals: number; assists: number } } };
	game: Game;
	teamNumber: "teamOne" | "teamTwo";
}) {
	const { team, game, teamNumber } = props;
	const players = useAppSelector((state) => state.players.list);

	const totalGoals = Object.values(team.players).reduce((acc, p) => acc + p.goals, 0);

	const firebaseApi = useFirebaseApi();

	const addGoal = (player: Player) => {
		firebaseApi.firesotre.updateDocument({
			collectionName: location.pathname.split("/").slice(0, -1).join("/"),
			id: game.id,
			data: {
				[`${teamNumber}.players.${player.id}.goals`]: firebaseApi.firesotre.increment(1),
			},
		});
	};

	return (
		<Stack
			sx={{
				width: "50%",
				textAlign: "center",
				alignItems: "center",
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
				{totalGoals}
			</Box>
			{Object.entries(team.players).map((entry) => {
				const [playerId, stats] = entry;
				const player = players.find((p) => p.id === playerId);
				return (
					<Stack
						key={player?.id}
						component={Card}
						justifyContent={"space-between"}
						// direction={"row"}
						alignItems="center"
						whiteSpace={"nowrap"}
						px={1}
					>
						<Typography fontSize={12}>{player?.name}</Typography>
						<Box>
							<IconButton color="primary">
								<SportsSoccerIcon onClick={() => addGoal(player)} />
							</IconButton>
							<IconButton color="secondary">
								<HdrAutoIcon />
							</IconButton>
						</Box>
					</Stack>
				);
			})}
		</Stack>
	);
}

function displayTimer(time: number) {
	console.log("====================================");
	console.log("time", time);
	console.log("====================================");
	const seconds = time % 60;
	const minutes = (time / 60) ^ 0;
	return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

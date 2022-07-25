import {
	Badge,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardMedia,
	Chip,
	Divider,
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
import { Game, GamePlayer } from "./Game";
import { differenceInSeconds } from "date-fns";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import HdrAutoIcon from "@mui/icons-material/HdrAuto";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { Player } from "Entities/Player";
import { arrayUnion, increment } from "firebase/firestore";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export const GamePage = () => {
	const { cycleId, groupId, gameId } = useParams<{
		cycleId: string;
		groupId: string;
		gameId: string;
	}>();

	const firebaseApi = useFirebaseApi();
	const actions = useActions();

	const navigate = useNavigate();

	const [date, setDate] = useState(Date.now());

	const [game, setGame] = useState<Game | null>(null);

	const ref = useRef<NodeJS.Timer>();

	useEffect(() => {
		if (game?.status == "active") {
			ref.current = setInterval(() => setDate(Date.now()), 1000);
		}
		return () => {
			clearInterval(ref.current);
		};
	}, [game?.status]);

	useEffect(() => {
		if (!gameId) return;
		const unsubscribe = firebaseApi.firesotre.subscribeDoc({
			collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
			docId: gameId,
			callback: (result) => {
				setGame(result.item);
			},
		});
		return unsubscribe;
	}, [cycleId]);

	const startGame = () => {
		if (game?.status === "not-active" || !game?.status) {
			// start
			firebaseApi.firesotre.updateDocument({
				collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
				id: gameId!,
				data: { gameStartDate: Date.now(), status: "active" },
			});
			setDate(Date.now());
		}
		if (game?.status === "active") {
			// pause
			firebaseApi.firesotre.updateDocument({
				collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
				id: gameId!,
				data: { status: "stopped", pauseStart: Date.now() },
			});
		}
		if (game?.status === "stopped") {
			// resume

			firebaseApi.firesotre.updateDocument({
				collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
				id: gameId!,
				data: {
					status: "active",
					pauseTotal: increment(Date.now() - game.pauseStart),
					pauseStart: 0,
				},
			});
			setDate(Date.now());
		}
	};

	if (!game) return null;

	const goals1 = getTeamStats(game.teams[0], game)?.goals;
	const goals2 = getTeamStats(game.teams[1], game)?.goals;

	const winner = goals1 > goals2 ? game.teams[0] : goals2 > goals1 ? game.teams[1] : "";

	const endGame = () => {
		firebaseApi.firesotre.updateDocument({
			collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
			id: gameId!,
			data: {
				status: "completed",
				gameEndDate: Date.now(),
				winner: winner,
			},
		});
		if (!winner) return;
		game.players.forEach((player) => {
			firebaseApi.firesotre.updateDocument({
				collectionName: `/players`,
				id: player.playerId,
				data: {
					games: firebaseApi.firesotre.increment(1),
					wins: firebaseApi.firesotre.increment(player.teamId === winner ? 1 : 0),
				},
			});
		});
	};

	console.log(game);
	

	type color =
		| "success"
		| "primary"
		| "default"
		| "secondary"
		| "error"
		| "info"
		| "warning"
		| undefined;

	function GameStatus() {
		const color: { [key: string]: color } = {
			completed: "success",
			"not-active": "primary",
			active: "primary",
			stopped: "primary",
		};
		return <Chip label={game?.status} color={color[game?.status || "not-active"]} />;
	}

	return (
		<AppBarWithDrawer
			onBack={() =>
				navigate(
					window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"))
				)
			}
			title="games"
		>
			<Stack m={2} alignItems={"center"} gap={2}>
				<Card
					sx={{
						maxWidth: "550px",
						margin: "auto",
						width: "100%",
					}}
				>
					<CardHeader
						disableTypography
						title={
							<Stack gap={1} justifyContent="space-between" direction={"row"}>
								<GameStatus />
								<Typography>English PL</Typography>
							</Stack>
						}
						subheader={
							<Stack>
								<Typography>{new Date().toLocaleDateString()}</Typography>
							</Stack>
						}
					/>
					<Divider />
					<Box>
						<Typography textAlign="center" variant="h4">
							{game.teams[0]} vs {game.teams[1]}
						</Typography>
					</Box>
					<Stack
						direction="row"
						justifyContent="space-between"
						sx={{
							borderRadius: 4,
						}}
						gap={2}
					>
						<RenderTeam game={game} team={game.teams[0]} endGame={endGame} />
						<RenderTeam game={game} team={game.teams[1]} endGame={endGame} />
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
								differenceInSeconds(
									game.status === "active" ? date : new Date(),
									new Date(
										game.gameStartDate +
											game.pauseTotal +
											(game.pauseStart ? Date.now() - game.pauseStart : 0 || 0) ||
											new Date()
									)
								)
							)}
						</Typography>
						<Button
							variant="contained"
							onClick={endGame}
							disabled={game.status === "completed"}
						>
							end
						</Button>
					</Stack>
				</Card>
				{goals1 === goals2 && (
					<Stack direction="row" alignItems={"center"} justifyContent={"space-between"}>
						<Typography>Select Winner</Typography>
						<Button
							onClick={() => {
								firebaseApi.firesotre.updateDocument({
									collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
									id: gameId!,
									data: {
										winner: game.teams[0],
									},
								});

								game.players.forEach((player) => {
									firebaseApi.firesotre.updateDocument({
										collectionName: `/players`,
										id: player.playerId,
										data: {
											games: firebaseApi.firesotre.increment(1),
											wins: firebaseApi.firesotre.increment(
												player.teamId === game.teams[0] ? 1 : 0
											),
										},
									});
								});
							}}
						>
							{game.teams[0]}
						</Button>
						<Button
							onClick={() => {
								firebaseApi.firesotre.updateDocument({
									collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
									id: gameId!,
									data: {
										winner: game.teams[1],
									},
								});
								game.players.forEach((player) => {
									firebaseApi.firesotre.updateDocument({
										collectionName: `/players`,
										id: player.playerId,
										data: {
											games: firebaseApi.firesotre.increment(1),
											wins: firebaseApi.firesotre.increment(
												player.teamId === game.teams[1] ? 1 : 0
											),
										},
									});
								});
							}}
						>
							{game.teams[1]}
						</Button>
					</Stack>
				)}
				<Button
					onClick={() => {
						navigate(`/groups/${groupId}/cycles/${cycleId}/games/create`);
					}}
				>
					start new game
				</Button>
			</Stack>
		</AppBarWithDrawer>
	);
};

function getTeamStats(teamId: string, game: Game): { goals: number; assists: number } {
	if (!game) return { goals: 0, assists: 0 };
	return game?.players.reduce(
		(acc, p) => {
			if (p.teamId === teamId) {
				acc.goals += p.goals ?? 0;
				acc.assists += p.assists ?? 0;
			}
			return acc;
		},
		{ goals: 0, assists: 0 }
	);
}

function RenderTeam(props: { team: string; game: Game; endGame: () => void }) {
	const { team, game, endGame } = props;
	const players = useAppSelector((state) => state.players.list);

	const totalGoals = getTeamStats(team, game).goals;
	const totalAssists = getTeamStats(team, game).assists;

	const firebaseApi = useFirebaseApi();

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const activePlayer = useRef<GamePlayer | null>(null);

	const handleContextMenu = (player: GamePlayer) => (event) => {
		event.preventDefault();
		setAnchorEl(event.currentTarget);
		activePlayer.current = player;
	};

	const handleClose = () => {
		setAnchorEl(null);
		activePlayer.current = null;
	};

	useEffect(() => {
		if (totalGoals === 2 && game.status !== "completed") {
			endGame();
		}
	}, [totalGoals]);

	const addGoal = (player: Player | undefined) => {
		if (!player) return;

		if (totalGoals >= 2) return;

		firebaseApi.firesotre.updateDocument({
			collectionName: location.pathname.split("/").slice(0, -1).join("/"),
			id: game.id,
			data: {
				players: game.players.map((p) =>
					p.playerId === player.id ? { ...p, goals: (p.goals ?? 0) + 1 } : p
				),
			},
		});
		firebaseApi.firesotre.updateDocument({
			collectionName: "players",
			id: player.id,
			data: {
				goals: firebaseApi.firesotre.increment(1),
			},
		});
	};

	const removeGoal = () => {
		if (!activePlayer.current || !activePlayer.current.goals) return;
		firebaseApi.firesotre.updateDocument({
			collectionName: location.pathname.split("/").slice(0, -1).join("/"),
			id: game.id,
			data: {
				players: game.players.map((p) =>
					p.playerId === activePlayer.current?.playerId
						? { ...p, goals: p.goals ? (p.goals ?? 0) - 1 : 0 }
						: p
				),
			},
		});
		firebaseApi.firesotre.updateDocument({
			collectionName: "players",
			id: activePlayer.current.playerId,
			data: {
				goals: firebaseApi.firesotre.increment(-1),
			},
		});
	};

	const removeAssist = () => {
		if (!activePlayer.current || !activePlayer.current.assists) return;

		firebaseApi.firesotre.updateDocument({
			collectionName: location.pathname.split("/").slice(0, -1).join("/"),
			id: game.id,
			data: {
				players: game.players.map((p) =>
					p.playerId === activePlayer.current?.playerId
						? { ...p, assists: p.assists ? (p.assists ?? 0) - 1 : 0 }
						: p
				),
			},
		});
		firebaseApi.firesotre.updateDocument({
			collectionName: "players",
			id: activePlayer.current.playerId,
			data: {
				assists: firebaseApi.firesotre.increment(-1),
			},
		});
	};

	const addAssist = (player: Player) => {
		if (!player) return;
		if (totalAssists >= 2) return;
		firebaseApi.firesotre.updateDocument({
			collectionName: location.pathname.split("/").slice(0, -1).join("/"),
			id: game.id,
			data: {
				players: game.players.map((p) =>
					p.playerId === player.id ? { ...p, assists: (p.assists ?? 0) + 1 } : p
				),
			},
		});
		firebaseApi.firesotre.updateDocument({
			collectionName: "players",
			id: player.id,
			data: {
				assists: firebaseApi.firesotre.increment(1),
			},
		});
	};

	return (
		<Stack
			sx={{
				width: "50%",
				textAlign: "center",
				alignItems: "stretch",
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
					margin: "auto",
				}}
			>
				{totalGoals}
			</Box>
			{game.players
				.filter((p) => p.teamId === team)
				.map((gamePlayer) => {
					const player = players.find((p) => p.id === gamePlayer.playerId);

					const goalsInGame = gamePlayer.goals;
					const assistsInGame = gamePlayer.assists;

					return (
						<Stack
							key={player?.id}
							component={Card}
							whiteSpace={"nowrap"}
							px={1}
							alignItems="center"
						>
							<Stack direction={"row"} alignItems="center" justifyContent={"space-between"}>
								<Typography fontSize={12}>{player?.name} </Typography>
							</Stack>
							<Box onContextMenu={handleContextMenu(gamePlayer)}>
								<IconButton color="primary">
									<Badge color="success" badgeContent={goalsInGame}>
										<SportsSoccerIcon onClick={() => addGoal(player)} />
									</Badge>
								</IconButton>
								<IconButton onClick={() => addAssist(player)} color="secondary">
									<Badge color="error" badgeContent={assistsInGame}>
										<HdrAutoIcon />
									</Badge>
								</IconButton>
							</Box>
							<Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
								<MenuItem
									onClick={() => {
										removeGoal();
										handleClose();
									}}
								>
									remove goal
								</MenuItem>
								<MenuItem
									onClick={() => {
										removeAssist();
										handleClose();
									}}
								>
									remove assist
								</MenuItem>
							</Menu>
						</Stack>
					);
				})}
		</Stack>
	);
}

function displayTimer(time: number) {
	const seconds = time % 60;
	const minutes = (time / 60) ^ 0;
	return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
}

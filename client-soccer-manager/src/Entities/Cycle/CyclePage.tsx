import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useActions, useAppSelector } from "store";
import {
	Button,
	CardActionArea,
	Divider,
	Stack,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import { Field } from "view/CreateEntity/CreateEntity";
import { useEffect, useState } from "react";
import { useFirebaseApi } from "firebase-api";

import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useCycleGames } from "hooks";
import { AppBarWithDrawer } from "components";

import LoopIcon from "@mui/icons-material/Loop";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Game } from "Entities";

import { Cycle } from "./Cycle";

type Team = string[];

export const useCycleForm = () => {
	const players = useAppSelector((state) => state.players.list);
	const fields = [
		{ name: "name", label: "Name", defaultValue: "" },
		{ name: "image", label: "Image", type: "file", defaultValue: "" },

		{
			name: "players",
			label: "Players",
			type: "select",
			list: players.map((p) => ({ label: p.name, value: p.id })),
			emptyValue: [],
			selectProps: { multiple: true },
		},
	];
	return { fields };
};

interface Props {}

interface TeamStat {
	goals: number;
	wins: number;
	games: number;
}

export const CyclePage = (props: Props) => {
	const params = useParams<{ cycleId: string; groupId: string }>();
	const players = useAppSelector((state) => state.players.list);
	const cycles = useAppSelector((state) => state.cycles.map[params.groupId!]);
	const cycle = cycles?.find((c) => c.id === params.cycleId) as Cycle;

	const groupForm = useCycleForm();

	const firebaseApi = useFirebaseApi();
	const navigate = useNavigate();

	const actions = useActions();

	const location = useLocation();

	const games = useCycleGames(cycle?.id) as Game[];

	console.log("games", games);

	function statTeam(): TeamStat {
		return { goals: 0, wins: 0, games: 0 };
	}

	const stats = games.reduce<{ team1: TeamStat; team2: TeamStat; team3: TeamStat }>(
		(result, game) => {
			if (game.winner) {
				result[game.winner as "team1" | "team2" | "team3"].wins++;
			}
			result[game.teams[0] as "team1" | "team2" | "team3"].games++;
			result[game.teams[1] as "team1" | "team2" | "team3"].games++;
			result[game.teams[0] as "team1" | "team2" | "team3"].goals = game.players.reduce(
				(acc, p) => {
					console.log("acc", acc);

					if (p.teamId === game.teams[0]) {
						acc += p.goals ?? 0;
					}
					return acc;
				},
				0
			);
			result[game.teams[1] as "team1" | "team2" | "team3"].goals = game.players.reduce(
				(acc, p) => {
					console.log("acc1", acc);

					if (p.teamId === game.teams[1]) {
						acc += p.goals ?? 0;
					}
					return acc;
				},
				0
			);

			return result;
		},
		{ team1: statTeam(), team2: statTeam(), team3: statTeam() }
	);

	console.log("stats", stats);

	const totalGamaes1 = games.filter(
		(game: Game) => game.teams[0] === "team1" || game.teams[1] === "team1"
	);
	const totalGamaes3 = games.filter(
		(game: Game) => game.teams[0] === "team3" || game.teams[1] === "team3"
	);
	const totalGamaes2 = games.filter(
		(game: Game) => game.teams[0] === "team2" || game.teams[1] === "team2"
	);
	const totalGoals1 = totalGamaes1?.reduce((acc, game: Game) => {
		// console.log("GG", acc);
		// if (game.teams[1] === "team1") {
		// 	const goals = Object.values(game.teamTwo.players).reduce(
		// 		(acc, player) => (acc += player.goals),
		// 		0
		// 	);
		// 	acc += goals;
		// 	return acc;
		// } else {
		// 	const goals = Object.values(game.teamOne.players).reduce(
		// 		(acc, player) => (acc += player.goals),
		// 		0
		// 	);
		// 	acc += goals;
		// 	return acc;
		// }
	}, 0);
	const totalGoals2 = totalGamaes2?.reduce((acc, game: Game) => {
		// console.log("GG", acc);
		// if (game.teams[1] === "team2") {
		// 	const goals = Object.values(game.teamTwo.players).reduce(
		// 		(acc, player) => (acc += player.goals),
		// 		0
		// 	);
		// 	acc += goals;
		// 	return acc;
		// } else {
		// 	const goals = Object.values(game.teamOne.players).reduce(
		// 		(acc, player) => (acc += player.goals),
		// 		0
		// 	);
		// 	acc += goals;
		// 	return acc;
		// }
	}, 0);
	const totalGoals3 = totalGamaes3?.reduce((acc, game: Game) => {
		// console.log("GG", acc);
		// if (game.teamTwo.name === "team3") {
		// 	const goals = Object.values(game.teamTwo.players).reduce(
		// 		(acc, player) => (acc += player.goals),
		// 		0
		// 	);
		// 	acc += goals;
		// 	return acc;
		// } else {
		// 	const goals = Object.values(game.teamOne.players).reduce(
		// 		(acc, player) => (acc += player.goals),
		// 		0
		// 	);
		// 	acc += goals;
		// 	return acc;
		// }
	}, 0);

	useEffect(() => {
		if (!cycle?.id) {
			const unsubscribe = firebaseApi.firesotre.subscribeDoc({
				collectionName: `groups/${params.groupId}/cycles`,
				docId: params.cycleId,
				callback: (result) => {
					actions.dispatch(
						actions.cycles.set({
							groupId: params.groupId,
							cycles: [result.item],
						})
					);
				},
			});
			return;
		}

		const unsubscribe = firebaseApi.firesotre.subscribeCollection({
			collectionName: `groups/${params.groupId}/cycles/${cycle.id}/games`,
			callback: (result) => {
				actions.dispatch(
					actions.games.set({
						cycleId: cycle.id,
						games: result.items,
					})
				);
			},
		});
		return () => unsubscribe();
	}, [cycle?.id]);

	if (!cycle) return null;

	const createGame = async () => {
		const res = await firebaseApi.firesotre.createDoc({
			collectionName: `groups/${params.id}/cycles/${cycle.id}/games`,
			data: { name: "new game" },
		});
	};

	return (
		<AppBarWithDrawer
			title="Cicle"
			onBack={() =>
				navigate(
					window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/"))
				)
			}
			drawerContent={
				<List>
					{["Games"].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton
								onClick={() => {
									actions.dispatch(actions.ui.closeSidebar());

									navigate(text.toLowerCase());
								}}
							>
								<ListItemIcon>
									<LoopIcon />
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			}
		>
			<Card sx={{ width: "100%" }}>
				<CardContent>
					<TableContainer component={Paper}>
						<Table sx={{}} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell></TableCell>
									<TableCell>team1</TableCell>
									<TableCell>team2</TableCell>
									<TableCell>team3</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell>wins</TableCell>
									<TableCell>{stats.team1.wins}</TableCell>
									<TableCell>{stats.team2.wins}</TableCell>
									<TableCell>{stats.team3.wins}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>games</TableCell>
									<TableCell>{stats.team1.games}</TableCell>
									<TableCell>{stats.team2.games}</TableCell>
									<TableCell>{stats.team3.games}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>goals</TableCell>
									<TableCell>{stats.team1.goals}</TableCell>
									<TableCell>{stats.team2.goals}</TableCell>
									<TableCell>{stats.team3.goals}</TableCell>
								</TableRow>
								<TableRow>
									<TableCell>goal/game</TableCell>
									<TableCell>
										{(stats.team1.goals / stats.team1.games).toFixed(2)}
									</TableCell>
									<TableCell>
										{(stats.team2.goals / stats.team2.games).toFixed(2)}
									</TableCell>
									<TableCell>
										{(stats.team3.goals / stats.team3.games).toFixed(2)}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</TableContainer>
					<Divider sx={{ marginBlock: 4 }} />
					<TableContainer component={Paper}>
						<Table sx={{}} aria-label="simple table">
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell>team</TableCell>
									<TableCell>goals</TableCell>
									<TableCell>assists</TableCell>
									<TableCell>games</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{cycle.players.map((cyclePlayer) => {
									const player = players.find((p) => p.id === cyclePlayer.playerId);
									if (!player) return null;

									return (
										<TableRow>
											<TableCell>{player.name}</TableCell>
											<TableCell>{cyclePlayer.teamId}</TableCell>
											<TableCell>{player.goals}</TableCell>
											<TableCell>{player.assists}</TableCell>
											<TableCell>{player.games}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				</CardContent>
			</Card>
		</AppBarWithDrawer>
	);
};

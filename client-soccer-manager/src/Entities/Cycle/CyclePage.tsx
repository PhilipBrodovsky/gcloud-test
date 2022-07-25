import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

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

	console.log('cycle',cycle);
	

	const groupForm = useCycleForm();

	const firebaseApi = useFirebaseApi();
	const navigate = useNavigate();

	const actions = useActions();

	const location = useLocation();

	const games = useCycleGames(cycle?.id) as Game[];

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
			result[game.teams[0] as "team1" | "team2" | "team3"].goals += game.players.reduce(
				(acc, p) => {
					if (p.teamId === game.teams[0]) {
						acc += p.goals ?? 0;
					}
					return acc;
				},
				0
			);
			result[game.teams[1] as "team1" | "team2" | "team3"].goals += game.players.reduce(
				(acc, p) => {
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
								{[...cycle.players]
									.sort((p1, p2) => {
										const goals1 =
											games.reduce((acc, g) => {
												if (g.teams.includes(p1.teamId)) {
													acc +=
														g.players.find((p) => p.playerId === p1.playerId)
															?.goals ?? 0;
												}
												return acc;
											}, 0) ?? 0;
										const goals2 =
											games.reduce((acc, g) => {
												if (g.teams.includes(p2.teamId)) {
													acc +=
														g.players.find((p) => p.playerId === p2.playerId)
															?.goals ?? 0;
												}
												return acc;
											}, 0) ?? 0;

										return goals2 - goals1;
									})
									.map((cyclePlayer) => {
										const player = players.find((p) => p.id === cyclePlayer.playerId);
										if (!player) return null;

										return (
											<TableRow>
												<TableCell>{player.name}</TableCell>
												<TableCell>{cyclePlayer.teamId}</TableCell>
												<TableCell>
													{games.reduce((acc, g) => {
														if (g.teams.includes(cyclePlayer.teamId)) {
															acc +=
																g.players.find(
																	(p) => p.playerId === cyclePlayer.playerId
																)?.goals ?? 0;
														}
														return acc;
													}, 0) ?? 0}
												</TableCell>
												<TableCell>
													{games.reduce((acc, g) => {
														if (g.teams.includes(cyclePlayer.teamId)) {
															acc +=
																g.players.find(
																	(p) => p.playerId === cyclePlayer.playerId
																)?.assists ?? 0;
														}
														return acc;
													}, 0) ?? 0}
												</TableCell>
												<TableCell>
													{games.reduce((acc, g) => {
														if (g.teams.includes(cyclePlayer.teamId)) {
															acc++;
														}
														return acc;
													}, 0) ?? 0}
												</TableCell>
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

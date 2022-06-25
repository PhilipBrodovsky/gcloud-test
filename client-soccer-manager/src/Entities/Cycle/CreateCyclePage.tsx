import {
	CardContent,
	Stack,
	Card,
	Avatar,
	Typography,
	CardHeader,
	Button,
	Container,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "store";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";
import { Field } from "view/CreateEntity/CreateEntity";
import { useFirebaseApi } from "firebase-api";

type Team = string[];
export interface Cycle {
	id: string;
	name: string;
	createDate: number; // timestampt
	image?: {
		url: string;
		bucket: string;
		fullPath: string;
		name: string;
	};
	players: string[];
	teams: any;
}

const fields = [];

export const CreateCyclePage = () => {
	const params = useParams<{ groupId: string }>();

	const group = useAppSelector((state) => state.groups.list.find((g) => g.id === params.groupId));
	const players = useAppSelector((state) => state.players.list);

	const navigate = useNavigate();

	const firebaseApi = useFirebaseApi();

	const [form, setForm] = useState<any>({
		numberOfTeams: group?.numberOfTeams,
		playersPerTeam: group?.playersPerTeam,
		teams: { team1: [], team2: [], team3: [] },
	});

	const { teams } = form;

	const handleToggle = (value: string, index: string) => () => {
		const team = teams[index];

		const anotherTeams = Object.entries(teams).filter(([name, team]) => name !== index);

		const playerHasTeam = anotherTeams.some(([name, t]) => t.includes(value));

		if (playerHasTeam) {
			console.log("player allready has team");

			return;
		}

		const currentIndex = team.indexOf(value);

		let newTeam = [...team];

		if (currentIndex === -1) {
			newTeam.push(value);
		} else {
			newTeam.splice(currentIndex, 1);
		}

		setForm({
			...form,
			teams: { ...form.teams, [index]: newTeam },
		});
	};

	const [selectedPlayers, setSelectedPlayers] = useState([]);

	const createForm = async () => {
		console.log("====================================");
		console.log("form", form);
		console.log("====================================");
		const res = await firebaseApi.firesotre.createDoc({
			collectionName: `groups/${group?.id}/cycles`,
			data: { ...form, createDate: new Date().getTime() },
		});
		console.log("res", res);
		navigate(-1);
	};

	return (
		<Container>
			<Stack width={"100%"} gap={4}>
				<Field
					onChange={(name, value) => setForm({ ...form, [name]: value })}
					value={form.numberOfTeams}
					field={{
						name: "numberOfTeams",
						label: "Number of teams",
						type: "number",
						defaultValue: group?.numberOfTeams,
					}}
				/>
				<Field
					value={form.playersPerTeam}
					onChange={(name, value) => setForm({ ...form, [name]: value })}
					field={{
						name: "playersPerTeam",
						label: "Players per team",
						type: "number",
						defaultValue: group?.playersPerTeam,
					}}
				/>
				<Field
					onChange={(_, value) => {
						setSelectedPlayers(value);
					}}
					value={selectedPlayers}
					field={{
						name: "players",
						label: "Players",
						type: "select",
						list: group.players.map((pId) => {
							const p = players.find((p) => p.id == pId);
							return { label: p.name, value: p.id };
						}),
						emptyValue: [],
						selectProps: { multiple: true },
					}}
				/>
				<List disablePadding dense sx={{ width: "100%", maxWidth: 300 }} subheader="Teams">
					{selectedPlayers.map((playerId, i) => {
						const player = players.find((p) => p.id == playerId);
						const colors = { team1: "blue", team2: "orange", team3: "green" };

						const team = Object.entries(teams).filter(([name, t]) => t.includes(playerId));

						const color = colors[team[0]];
						return (
							<ListItem
								key={playerId}
								secondaryAction={
									<>
										<Checkbox
											edge="end"
											onChange={handleToggle(playerId, "team1")}
											checked={teams.team1.indexOf(playerId) !== -1}
										/>
										<Checkbox
											edge="end"
											onChange={handleToggle(playerId, "team2")}
											checked={teams.team2.indexOf(playerId) !== -1}
											color="secondary"
										/>
										<Checkbox
											edge="end"
											onChange={handleToggle(playerId, "team3")}
											checked={teams.team3.indexOf(playerId) !== -1}
											color="success"
										/>
									</>
								}
								disablePadding
							>
								<ListItemButton>
									<ListItemAvatar>
										<Avatar sx={{ width: 30, height: 30 }} src={player?.image?.url} />
									</ListItemAvatar>
									<ListItemText
										id={playerId}
										sx={{ color: color }}
										primary={`${i} ${player.name}`}
									/>
								</ListItemButton>
							</ListItem>
						);
					})}
				</List>
				<Button onClick={createForm} variant="contained">
					Create
				</Button>
			</Stack>
		</Container>
	);
};

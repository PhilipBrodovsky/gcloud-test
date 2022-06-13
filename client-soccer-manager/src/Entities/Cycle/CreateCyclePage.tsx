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
import { useParams } from "react-router-dom";
import { useAppSelector } from "store";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";
import { Field } from "view/CreateEntity/CreateEntity";

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
	teams: Team[];
}

const fields = [];

export const CreateCyclePage = () => {
	const params = useParams<{ groupId: string }>();

	const group = useAppSelector((state) => state.groups.list.find((g) => g.id === params.groupId));
	const players = useAppSelector((state) => state.players.list);

	const [form, setForm] = useState({
		teams: [[], [], []],
	});

	const handleToggle = (value, index) => () => {
		const team = teams[index];

		const anotherTeams = teams.filter((t, i) => i !== index);

		const playerHasTeam = anotherTeams.some((t) => t.includes(value));

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
			teams: teams.map((t, i) => {
				if (i === index) return newTeam;
				return t;
			}),
		});
	};

	const [selectedPlayers, setSelectedPlayers] = useState([]);

	const { teams } = form;

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
						const colors = ["blue", "orange", "green"];

						const color = colors[teams.findIndex((t) => t.indexOf(playerId) !== -1)];

						return (
							<ListItem
								key={playerId}
								secondaryAction={
									<>
										<Checkbox
											edge="end"
											onChange={handleToggle(playerId, 0)}
											checked={teams[0].indexOf(playerId) !== -1}
										/>
										<Checkbox
											edge="end"
											onChange={handleToggle(playerId, 1)}
											checked={teams[1].indexOf(playerId) !== -1}
											color="secondary"
										/>
										<Checkbox
											edge="end"
											onChange={handleToggle(playerId, 2)}
											checked={teams[2].indexOf(playerId) !== -1}
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
				<Button variant="contained">Create</Button>
			</Stack>
		</Container>
	);
};

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
import { Button, CardActionArea, Divider, Stack } from "@mui/material";
import { Field } from "view/CreateEntity/CreateEntity";
import { useEffect, useState } from "react";
import { useFirebaseApi } from "firebase-api";

import { useNavigate, useLocation } from "react-router-dom";

export interface Group {
	id: string;
	name: string;
	numberOfTeams: number;
	playersPerTeam: number;
	image?: {
		url: string;
		bucket: string;
		fullPath: string;
		name: string;
	};
	players: string[];
}

export const useGroupForm = () => {
	const players = useAppSelector((state) => state.players.list);

	const fields = [
		{ name: "name", label: "Name", defaultValue: "" },
		{ name: "image", label: "Image", type: "file", defaultValue: "" },
		{ name: "numberOfTeams", label: "Number of teams", type: "number", defaultValue: 0 },
		{ name: "playersPerTeam", label: "Players per team", type: "number", defaultValue: 0 },

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

interface Props {
	group: Group;
}
export const GroupPage = (props: Props) => {
	const { group } = props;
	const players = useAppSelector((state) => state.players.list);

	const groupForm = useGroupForm();

	const firebaseApi = useFirebaseApi();
	const navigate = useNavigate();

	const actions = useActions();

	const location = useLocation();

	const cycles = useAppSelector((state) => state.cycles.map[group.id]);

	useEffect(() => {
		const unsubscribe = firebaseApi.firesotre.subscribeCollection({
			collectionName: `groups/${group.id}/cycles`,
			callback: (result) => {
				actions.dispatch(
					actions.cycles.set({
						groupId: group.id,
						cycles: result.items,
					})
				);
			},
		});
		return () => unsubscribe();
	}, [group.id]);

	const createCycle = async () => {
		const res = await firebaseApi.firesotre.createDoc({
			collectionName: `groups/${group.id}/cycles`,
			data: { name: "cycle", createDate: new Date().getTime() },
		});
	};

	return (
		<Card sx={{ width: "100%" }}>
			<CardHeader
				avatar={<Avatar sx={{ bgcolor: red[500] }}>R</Avatar>}
				action={
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				}
				title={group.name}
				subheader="September 14, 2016"
			/>
			<CardMedia component="img" height="194" image={group.image?.url} alt="Paella dish" />
			<CardContent>
				<Stack gap={4}>
					<Field
						value={group.numberOfTeams}
						field={{ name: "numberOfTeams", label: "Number of teams", type: "number" }}
					/>
					<Field
						value={group.playersPerTeam}
						field={{ name: "playersPerTeam", label: "Players per team", type: "number" }}
					/>
				</Stack>
				<Divider sx={{ my: 2 }} />
				<Field
					value={group.players || []}
					onChange={(_, newPlayers) => {
						firebaseApi.firesotre.updateDocument({
							collectionName: "groups",
							id: group.id,
							data: { players: newPlayers },
						});
					}}
					field={groupForm.fields.find((f) => f.name === "players")}
					fullWidth
				/>
				<Stack my={2} direction="row" gap={2} flexWrap="wrap">
					{group.players?.map((playerId) => {
						const player = players.find((p) => p.id === playerId);
						if (!player) return null;
						return (
							<Card key={player.id}>
								<CardHeader
									avatar={<Avatar sx={{ bgcolor: red[500] }}>R</Avatar>}
									action={
										<IconButton>
											<MoreVertIcon />
										</IconButton>
									}
									title={player.name}
									subheader={player.id}
								/>
							</Card>
						);
					})}
				</Stack>
				<Divider sx={{ my: 2 }} />
				<Stack direction="row" alignItems="center" justifyContent="space-between">
					<Typography variant="h4">Cycles</Typography>
					<Button onClick={createCycle} variant="contained">
						Create
					</Button>
				</Stack>
				<Stack my={2} direction="row" gap={2} flexWrap="wrap">
					{cycles?.map((cycle: any) => {
						return (
							<Card key={cycle.id}>
								<CardHeader
									avatar={<Avatar sx={{ bgcolor: red[500] }}>R</Avatar>}
									action={
										<IconButton>
											<MoreVertIcon />
										</IconButton>
									}
									title={cycle.name}
									subheader={new Date(cycle.createDate).toDateString()}
								/>
								<CardActionArea
									onClick={() => {
										navigate(`${location.pathname}/cycles/${cycle.id}`);
									}}
								>
									<CardMedia component="img" image="/soccer.jpeg" height="120" />
								</CardActionArea>
								<CardContent>dsas</CardContent>
							</Card>
						);
					})}
				</Stack>
			</CardContent>
		</Card>
	);
};

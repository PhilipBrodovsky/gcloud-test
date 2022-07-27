import {
	Button,
	Card,
	Checkbox,
	Divider,
	Fab,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	Stack,
	Typography,
} from "@mui/material";
import { AppBarWithDrawer } from "components";
import { useFirebaseApi } from "firebase-api";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActions, useAppSelector } from "store";
import AddIcon from "@mui/icons-material/Add";
import { GamesRounded } from "@mui/icons-material";
import { Field } from "view/CreateEntity/CreateEntity";
import { Game } from "./Game";
import { Cycle } from "Entities";

export const CreateGame = () => {
	const { cycleId, groupId } = useParams<{ cycleId: string; groupId: string }>();

	const firebaseApi = useFirebaseApi();
	const actions = useActions();

	const cycles = useAppSelector((state) => state.cycles.map[groupId!]);
	const cycle: Cycle = cycles?.find((c: Cycle) => c.id === cycleId);

	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = firebaseApi.firesotre.subscribeDoc({
			collectionName: `groups/${groupId}/cycles`,
			docId: cycleId!,
			callback: (result) => {
				actions.dispatch(
					actions.cycles.setCycle({
						cycle: result.item,
						groupId: groupId!,
					})
				);
			},
		});
		return unsubscribe;
	}, [cycleId]);

	const [teamOne, setTeamOne] = useState("");
	const [teamTwo, setTeamTwo] = useState("");

	if (!cycle) return null;

	const createTeam = async () => {
		// cycle
		const newGame: Omit<Game, "id"> = {
			teams: [teamOne, teamTwo],
			players: cycle.players
				.filter((p) => p.teamId === teamOne || p.teamId === teamTwo)
				.map((cp) => ({ ...cp, goals: 0, assists: 0 })),
			createDate: Date.now(),
			gameStartDate: 0,
			gameEndDate: 0,
			pauseStart: 0,
			pauseTotal: 0,
			status: "not-active",
		};
		await firebaseApi.firesotre.createDoc({
			collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
			data: newGame,
		});
		navigate(`/groups/${groupId}/cycles/${cycleId}/games`);
	};

	function RenderTeams({ onChange, value, disabled }) {
		return (
			<Stack gap={2}>
				{["team1", "team2", "team3"].map((id) => {
					return (
						<Button
							key={id}
							color="primary"
							variant={"contained"}
							sx={{
								width: 100,
								height: 50,
								backgroundColor: disabled !== id && cycle?.teams?.[id]?.color,
								"&:hover": {
									backgroundColor: disabled !== id && cycle?.teams?.[id]?.color,
								},
							}}
							disabled={disabled === id}
							onClick={() => onChange(value === id ? "" : id)}
						>
							<Typography sx={{ mixBlendMode: disabled === id ? "initial" : "difference" }}>
								{id}
							</Typography>
						</Button>
					);
				})}
			</Stack>
		);
	}

	return (
		<AppBarWithDrawer title="Create Game">
			<Typography textAlign={"center"} variant="h3">
				Select Teams
			</Typography>
			<Stack direction="row" gap={2} alignItems="center" justifyContent="center">
				<Button
					color="primary"
					variant={"contained"}
					sx={{
						width: 100,
						height: 50,
						bgcolor: cycle?.teams?.[teamOne]?.color,
						"&:hover": {
							bgcolor: cycle?.teams?.[teamOne]?.color,
						},
					}}
				>
					<Typography sx={{ mixBlendMode: "difference" }}>{teamOne}</Typography>
				</Button>
				<Typography textAlign={"center"} variant="h4">
					VS
				</Typography>

				<Button
					color="primary"
					variant={"contained"}
					sx={{
						width: 100,
						height: 50,
						bgcolor: cycle?.teams?.[teamTwo]?.color,
						"&:hover": {
							bgcolor: cycle?.teams?.[teamTwo]?.color,
						},
					}}
				>
					<Typography sx={{ mixBlendMode: "difference" }}>{teamTwo}</Typography>
				</Button>
			</Stack>
			<Divider sx={{ my: 2 }} />

			<Stack direction="row" margin={2} gap={10} justifyContent="center">
				<RenderTeams
					onChange={(value) => setTeamOne(value)}
					value={teamOne}
					disabled={teamTwo}
				/>
				<RenderTeams
					onChange={(value) => setTeamTwo(value)}
					value={teamTwo}
					disabled={teamOne}
				/>
			</Stack>
			<Button onClick={createTeam} variant="contained">
				Create
			</Button>
		</AppBarWithDrawer>
	);
};

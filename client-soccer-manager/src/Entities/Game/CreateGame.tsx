import {
	Button,
	Card,
	Checkbox,
	Fab,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	Stack,
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
	return (
		<AppBarWithDrawer title="Create Game">
			<Stack direction="row" margin={2} justifyContent="center">
				<FormControl>
					<FormLabel id="demo-radio-buttons-group-label">Team 1</FormLabel>
					<RadioGroup
						aria-labelledby="demo-radio-buttons-group-label"
						defaultValue="female"
						name="radio-buttons-group"
						onChange={(_, value) => setTeamOne(value)}
					>
						{["team1", "team2", "team3"].map((id) => {
							return (
								<FormControlLabel
									disabled={teamTwo === id}
									value={id}
									control={<Radio />}
									label={id}
								/>
							);
						})}
					</RadioGroup>
				</FormControl>
				<FormControl>
					<FormLabel id="demo-radio-buttons-group-label">Team 2</FormLabel>
					<RadioGroup
						aria-labelledby="demo-radio-buttons-group-label"
						defaultValue="female"
						name="radio-buttons-group"
						onChange={(_, value) => setTeamTwo(value)}
					>
						{["team1", "team2", "team3"].map((id) => {
							return (
								<FormControlLabel
									value={id}
									control={<Radio color="secondary" />}
									label={id}
									disabled={teamOne === id}
								/>
							);
						})}
					</RadioGroup>
				</FormControl>
			</Stack>
			<Button onClick={createTeam} variant="contained">
				Create
			</Button>
		</AppBarWithDrawer>
	);
};

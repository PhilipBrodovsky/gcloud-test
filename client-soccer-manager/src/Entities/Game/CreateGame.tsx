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
import { Cycle } from "Entities/Cycle";
import { Game } from "./Game";

export const CreateGame = () => {
	const { cycleId, groupId } = useParams<{ cycleId: string; groupId: string }>();

	const firebaseApi = useFirebaseApi();
	const actions = useActions();

	const cycles = useAppSelector((state) => state.cycles.map[groupId!]);
	const cycle: Cycle = cycles?.find((c: Cycle) => c.id === cycleId);

	const navigate = useNavigate();

	useEffect(() => {
		firebaseApi.firesotre.subscribeCollection({
			collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
			callback: (result) => {
				console.log(result);
				actions.dispatch(
					actions.games.set({
						cycleId: cycleId!,
						games: result.items,
					})
				);
			},
		});

		firebaseApi.firesotre.subscribeDoc({
			collectionName: `groups/${groupId}/cycles`,
			docId: cycleId!,
			callback: (result) => {
				console.log(result);
				actions.dispatch(
					actions.cycles.setCycle({
						cycle: result.item,
						groupId: groupId!,
					})
				);
			},
		});
	}, [cycleId]);

	const [selectedTeams, setSelectedTeams] = useState({
		teamOne: "",
		teamTwo: "",
	});

	if (!cycle) return null;

	const createTeam = async () => {
		// cycle
		const newGame: Game = {
			teamOne: {
				name: selectedTeams.teamOne,
				players: cycle.teams[selectedTeams.teamOne].reduce((acc, id) => {
					acc[id] = {
						goals: 0,
						assists: 0,
					};
					return acc;
				}, {}),
			},
			teamTwo: {
				name: selectedTeams.teamTwo,
				players: cycle.teams[selectedTeams.teamTwo].reduce((acc, id) => {
					acc[id] = {
						goals: 0,
						assists: 0,
					};
					return acc;
				}, {}),
			},
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
						onChange={(_, value) => setSelectedTeams({ ...selectedTeams, teamOne: value })}
					>
						{Object.entries(cycle.teams).map(([id, team]) => {
							return <FormControlLabel value={id} control={<Radio />} label={id} />;
						})}
					</RadioGroup>
				</FormControl>
				<FormControl>
					<FormLabel id="demo-radio-buttons-group-label">Team 2</FormLabel>
					<RadioGroup
						aria-labelledby="demo-radio-buttons-group-label"
						defaultValue="female"
						name="radio-buttons-group"
						onChange={(_, value) => setSelectedTeams({ ...selectedTeams, teamTwo: value })}
					>
						{Object.entries(cycle.teams).map(([id, team]) => {
							return (
								<FormControlLabel
									value={id}
									control={<Radio color="secondary" />}
									label={id}
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

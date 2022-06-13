import {
	CardHeader,
	Card,
	CardContent,
	Stack,
	Typography,
	Button,
	IconButton,
} from "@mui/material";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import HdrAutoIcon from "@mui/icons-material/HdrAuto";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { useEffect, useRef, useState } from "react";
import { useFirebaseApi } from "firebase-api";
import { useLocation } from "react-router-dom";

interface Game {
	id: string;
	goals: { [key: string]: number };
	assists: { [key: string]: number };
}

interface Pross {
	game: Game;
}
export const GamePage = (props: Props) => {

	const { game } = props;

	const [isStarted, setIsStarted] = useState(false);
	const [gameTime, setGameTime] = useState(480);

	const timerRef = useRef(null);

	const location = useLocation();
	const firebaseApi = useFirebaseApi();

	useEffect(() => {
		if (!isStarted) return clearInterval(timerRef.current);

		timerRef.current = setInterval(() => {
			setGameTime((prev) => prev - 1);
		}, 1000);
	}, [isStarted]);

	const addGoal = (id: string) => {
		firebaseApi.firesotre.updateDocument({
			collectionName: location.pathname.split("/").slice(0, -1).join("/"),
			id: game.id,
			data: {
				[`goals.${id}`]: firebaseApi.firesotre.increment(1),
			},
		});
	};
	const removeGoal = () => {};

	return (
		<Card>
			<CardHeader title="2:1" />
			<CardContent>
				<Stack gap={2} direction="row">
					{[1, 2].map((team) => {
						const players = [1, 2, 3, 4, 5];
						return (
							<Stack>
								<Typography>{gameTime}</Typography>
								<Typography>team {team}</Typography>
								<Stack>
									<IconButton
										onClick={() => {
											setIsStarted(!isStarted);
										}}
										color="primary"
									>
										{isStarted ? <StopCircleIcon /> : <PlayCircleFilledIcon />}
									</IconButton>
								</Stack>
								<Stack gap={1}>
									{players.map((player) => {
										return (
											<Card>
												{player}
												<IconButton color="primary">
													<SportsSoccerIcon onClick={() => addGoal(player)} />
												</IconButton>
												<IconButton color="secondary">
													<HdrAutoIcon />
												</IconButton>
											</Card>
										);
									})}
								</Stack>
							</Stack>
						);
					})}
				</Stack>
			</CardContent>
		</Card>
	);
};

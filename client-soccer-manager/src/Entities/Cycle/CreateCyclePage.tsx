import { CardContent, Stack, Card, Avatar, Typography, CardHeader } from "@mui/material";

export interface Cycle {
	id: string;
	name: string;
	image?: {
		url: string;
		bucket: string;
		fullPath: string;
		name: string;
	};
	players: string[];
	teams: Team[];
}

const teams = [
	[1, 2, 3, 4, 5],
	[1, 2, 3, 4, 5],
	[1, 2, 3, 4, 5],
];

const fields = [];

export const CreateCyclePage = () => {
	return (
		<Stack>
			<Stack direction="row" flexWrap="wrap" gap={2} justifyContent="center">
				{teams.map((team, i) => {
					return (
						<Card sx={{ minWidth: 300 }}>
							<CardHeader title={`Team ${i}`} subheader="wins: 3" />
							<CardContent>
								<Stack gap={2}>
									{team.map((player) => {
										return (
											<Stack gap={1} alignItems="center" direction="row">
												<Avatar>{player}</Avatar>
												<Typography variant="body2" color="text.secondary">
													player: {player}
												</Typography>
											</Stack>
										);
									})}
								</Stack>
							</CardContent>
						</Card>
					);
				})}
			</Stack>
		</Stack>
	);
};

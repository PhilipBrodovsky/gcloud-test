import { Box, Stack, Typography } from "@mui/material";

export const HomePage = () => {
	return (
		<Stack sx={{ margin: "0 auto" }}>
			<Typography variant="h3">Manage Your Dream Team</Typography>
			<Typography variant="body1">
				Create groups, players, assign players to group and start play.
			</Typography>
		</Stack>
	);
};

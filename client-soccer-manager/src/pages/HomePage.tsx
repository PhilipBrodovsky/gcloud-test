import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
	const navigate = useNavigate();
	return (
		<Stack sx={{ margin: "0 auto", p: 2 }} gap={2}>
			<Typography variant="h5">Manage Your Dream Team</Typography>
			<Typography variant="h6">how to start?</Typography>
			<Typography variant="body1">1) add some players</Typography>
			<Typography variant="body1">2) create group</Typography>
			<Typography variant="body1">3) in your group create new cycle</Typography>
			<Typography variant="body1">3) in your cycle create new game</Typography>
			<Typography variant="body1">3) start the game</Typography>

			<Button onClick={() => navigate("/players/create")} variant="contained">
				Add Players
			</Button>
			<Button onClick={() => navigate("/groups/create")} variant="contained">
				Add Group
			</Button>
		</Stack>
	);
};

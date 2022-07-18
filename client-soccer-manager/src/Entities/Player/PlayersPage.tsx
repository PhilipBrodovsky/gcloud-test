import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { useAppSelector } from "store";
import { CardActionArea } from "@mui/material";
import { useFirebaseApi } from "firebase-api";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { Fab, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Player } from "./Player";
import { PlayerCard } from "./PlayerCard";
import { AppBarWithDrawer } from "components";

export function PlayersPage() {
	const navigate = useNavigate();
	const players = useAppSelector((state) => state.players.list);

	return (
		<AppBarWithDrawer title="Players" onBack={() => navigate("/")}>
			<Stack
				sx={{
					flexGrow: 1,
					background: `rgba(0, 0, 0, 1)  radial-gradient(ellipse at center,rgba(212, 157, 28, 0.5),rgba(37, 34, 29, 0.3))`,
				}}
				id="EntityListPage"
				width="100%"
			>
				<Stack
					width="100%"
					direction="row"
					mt={2}
					gap={2}
					flexWrap="wrap"
					justifyContent="center"
				>
					{players.map((player) => {
						return <PlayerCard player={player} key={player.id} />;
					})}
				</Stack>
				<Fab
					onClick={() => navigate(`/players/create`)}
					color="primary"
					aria-label="add"
					sx={{
						position: "fixed",
						bottom: 16,
						right: 16,
					}}
				>
					<AddIcon />
				</Fab>
			</Stack>
		</AppBarWithDrawer>
	);
}

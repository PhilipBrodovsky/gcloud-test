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

export function PlayerCard(props: { player: Player }) {
	const { player } = props;
	const firebaseApi = useFirebaseApi();

	const navigate = useNavigate();

	return (
		<Card sx={{ minWidth: 280, maxWidth: 320, width: "100%", position: "relative" }}>
			<CardHeader
				avatar={<Avatar>{parseInt(Math.random() * (99 - 50) + 50)}</Avatar>}
				action={
					<IconButton
						onClick={() => {
							// todo: remove player form groups
							firebaseApi.firesotre.deleteDocument({
								collectionName: "players",
								id: player.id,
							});
							player.image && firebaseApi.storage.deleteFile(player.image.fullPath);
						}}
					>
						<DeleteIcon />
					</IconButton>
				}
				title={player.name || "Player"}
			/>
			<CardActionArea
				onClick={() => {
					navigate(`/players/${player.id}`);
				}}
			>
				<CardMedia
					sx={{
						aspectRatio: "9/10",
					}}
					alt=""
					component="img"
					src={player.image?.url || "/player.png"}
				/>
			</CardActionArea>
		</Card>
	);
}

export function PlayersPage() {
	const navigate = useNavigate();
	const players = useAppSelector((state) => state.players.list);

	return (
		<Stack id="EntityListPage" width="100%">
			<Stack width="100%" direction="row" gap={2} flexWrap="wrap" justifyContent="center">
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
	);
}

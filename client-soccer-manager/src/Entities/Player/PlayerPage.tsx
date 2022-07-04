import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Player } from "./Player";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFirebaseApi } from "firebase-api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const PlayerPage = () => {
	const firebaseApi = useFirebaseApi();
	const navigate = useNavigate();

	const [player, setPlayer] = useState(null);

	const params = useParams<{ id: string }>();

	useEffect(() => {
		if (!params.id) return;

		const unsubscribe = firebaseApi.firesotre.subscribeDoc({
			collectionName: "players",
			docId: params.id,
			callback: (res) => setPlayer(res.item),
		});
		return () => unsubscribe();
	}, [params.id]);

	if (!player) return null;

	return (
		<Card sx={{ width: "100%", margin: 2, boxSizing: "border-box" }}>
			<CardHeader
				avatar={<Avatar src={player.image?.url} sx={{ bgcolor: "darkblue" }} />}
				action={
					<IconButton
						onClick={() => {
							// todo: remove player form groups
							firebaseApi.firesotre.deleteDocument({
								collectionName: "players",
								id: player.id,
							});
							player.image && firebaseApi.storage.deleteFile(player.image.fullPath);
							navigate(`/players`);
						}}
					>
						<DeleteIcon />
					</IconButton>
				}
				title={player.name}
			/>
			<CardContent>
				<CardMedia
					sx={{ maxWidth: 300, margin: "auto" }}
					component="img"
					image={player.image?.url}
					alt="Paella dish"
				/>
				<Typography variant="body2" color="text.secondary">
					Goals: 10
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Assists: 20
				</Typography>
				<Typography variant="body2" color="text.secondary">
					games: 20
				</Typography>
			</CardContent>
		</Card>
	);
};

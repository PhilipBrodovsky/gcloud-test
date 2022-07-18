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
import { AppBarWithDrawer } from "components";
import { Stack, TextField } from "@mui/material";
import { UrlUtils } from "utils";

export const PlayerPage = () => {
	const firebaseApi = useFirebaseApi();
	const navigate = useNavigate();

	const [player, setPlayer] = useState<Player | null>(null);
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
		<AppBarWithDrawer
			title={`Player -  ${player.name}`}
			onBack={() => navigate(UrlUtils.removeLastPath(location.pathname))}
		>
			<Stack alignItems={"center"} justifyContent="center" p={2} flexGrow={1}>
				<Card
					sx={{
						width: "100%",
						maxWidth: 450,
						boxSizing: "border-box",
					}}
				>
					<CardHeader
						avatar={<Avatar>99</Avatar>}
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
					<CardMedia
						sx={{
							height: 350,
							borderTop: "1px  solid lightgray",
							borderBottom: "1px  solid lightgray",
						}}
						component="img"
						image={player.image?.url || "/player.png"}
						alt="Paella dish"
					/>
					<CardContent>
						<Typography variant="body2" color="text.secondary">
							Goals: {player.goals || 0}
						</Typography>

						<Typography variant="body2" color="text.secondary">
							Assists: {player.assists || 0}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							games: {player.games || 0}
						</Typography>
					</CardContent>
				</Card>
			</Stack>
		</AppBarWithDrawer>
	);
};

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
import { calculateRank, Player } from "./Player";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFirebaseApi } from "firebase-api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppBarWithDrawer } from "components";
import { Button, Stack, TextField } from "@mui/material";
import { UrlUtils } from "utils";
import { FileUpload } from "components/FileUpload";

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
						position: "relative",
					}}
				>
					<CardHeader
						avatar={
							<Avatar>
								{calculateRank(
									player.games ?? 0,
									player.goals ?? 0,
									player.assists ?? 0,
									player.wins ?? 0
								)}
							</Avatar>
						}
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
					<FileUpload
						onChange={async (name, file) => {
							console.log("file", file);
							const image =
								file &&
								(await firebaseApi.storage.uploadFile(file, `players/${player.id}`));
							console.log(image);
							
							file &&
								(await firebaseApi.firesotre.updateDocument({
									collectionName: "players",
									id: player.id,
									data: { image: image?.data || null },
								}));
						}}
						sx={{ position: "absolute", top: 86, right: 16 }}
					>
						Change Photo
					</FileUpload>
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
							games: {player.games || 0}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							wins: {player.wins || 0}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Goals: {player.goals || 0}
						</Typography>

						<Typography variant="body2" color="text.secondary">
							Assists: {player.assists || 0}
						</Typography>
					</CardContent>
				</Card>
			</Stack>
		</AppBarWithDrawer>
	);
};

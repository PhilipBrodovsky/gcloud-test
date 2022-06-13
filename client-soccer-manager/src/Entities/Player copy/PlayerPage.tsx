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

interface Props {
	player: Player;
}

export const PlayerPage = (props: Props) => {
	const { player } = props;
	return (
		<Card sx={{ width: "100%" }}>
			<CardHeader
				avatar={<Avatar sx={{ bgcolor: red[500] }}>P</Avatar>}
				action={
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				}
				title={player.name}
			/>
			<CardContent>
				<CardMedia
					sx={{ maxWidth: 350, margin: "auto" }}
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

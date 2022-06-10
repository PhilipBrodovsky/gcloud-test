import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAppSelector } from "store";

export interface Player {
	id: string;
	name: string;
	image: string;
}
interface Props {
	player: Player;
}



export const usePlayerForm = () => {
	const fields = [
		{ name: "name", label: "Name", defaultValue: "" },
		{ name: "image", label: "Image", defaultValue: "", type: "file" },
	];
	return { fields };
};

export const PlayerPage = (props: Props) => {
	const { player } = props;
	return (
		<Card sx={{ width: "100%" }}>
			<CardHeader
				avatar={<Avatar sx={{ bgcolor: red[500] }}>R</Avatar>}
				action={
					<IconButton>
						<MoreVertIcon />
					</IconButton>
				}
				title={player.name}
				subheader="September 14, 2016"
			/>
			<CardMedia component="img" height="194" image={player.image} alt="Paella dish" />
			<CardContent>
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
			<CardActions disableSpacing>
				<IconButton aria-label="add to favorites">
					<FavoriteIcon />
				</IconButton>
				<IconButton aria-label="share">
					<ShareIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
};

import {
	AppBar,
	Avatar,
	Button,
	Card,
	CardActionArea,
	CardActions,
	CardContent,
	CardHeader,
	CardMedia,
	CssBaseline,
	Fab,
	IconButton,
	Stack,
	Toolbar,
	Typography,
} from "@mui/material";
import { Favorite, Menu, MoreVert } from "@mui/icons-material";
import { entityName, getEntityData } from "utils/entity";
import { useNavigate } from "react-router-dom";

interface Props {
	entity: entityName;
	items: any[];
}

export function EntityList(props: any) {
	const { entity, items } = props;

	const EntityItem = entity === "group" ? GroupCard : PlayerCard;
	return (
		<Stack direction="row" gap={2} flexWrap="wrap" justifyContent="center">
			{items.map((item) => {
				return <EntityItem entity={entity} item={item} key={item.id} />;
			})}
		</Stack>
	);
}

export function PlayerCard(props: any) {
	const { item, entity } = props;

	const navigate = useNavigate();
	const entityData = getEntityData(entity);

	return (
		<Card sx={{ minWidth: 280, maxWidth: 320, width: "100%", position: "relative" }}>
			<CardHeader
				avatar={<Avatar>{parseInt(Math.random() * (99 - 50) + 50)}</Avatar>}
				action={
					<IconButton>
						<MoreVert />
					</IconButton>
				}
				title={item.name}
				subheader={new Date().toDateString()}
			/>
			<CardActionArea
				onClick={() => {
					navigate(`${entityData.path}/${item.id}`);
				}}
			>
				<CardMedia
					sx={{
						aspectRatio: "5/4",
					}}
					alt=""
					component="img"
					image="/download.jpg"
				/>
				<CardContent></CardContent>
			</CardActionArea>
			<CardActions>
				<IconButton>
					<Favorite />
				</IconButton>
			</CardActions>
		</Card>
	);
}

export function GroupCard(props: Props) {
	const { entity, item } = props;

	const navigate = useNavigate();
	const entityData = getEntityData(entity);
	return (
		<Card sx={{ maxWidth: 345 }}>
			<CardHeader
				avatar={<Avatar>S</Avatar>}
				action={
					<IconButton>
						<MoreVert />
					</IconButton>
				}
				title="Soccer"
				subheader={new Date().toDateString()}
			/>
			<CardActionArea
				onClick={() => {
					navigate(`${entityData.path}/${item.id}`);
				}}
			>
				<CardMedia alt="" component="img" image="/soccer.jpeg" height="200" />
				<CardContent>
					<Typography>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut quae laborum odio
						iste tempore provident ea impedit corporis, ut, maxime recusandae quasi suscipit
						voluptatem commodi odit corrupti quam totam distinctio!
					</Typography>
				</CardContent>
				ƒ
			</CardActionArea>
			<CardActions>
				<IconButton>
					<Favorite />
				</IconButton>
			</CardActions>
		</Card>
	);
}

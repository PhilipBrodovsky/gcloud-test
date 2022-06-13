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

import DeleteIcon from "@mui/icons-material/Delete";
import { useFirebaseApi } from "firebase-api";
import { Group, Player } from "Entities";

export function EntityList(props: any) {
	const { entity, items = [] } = props;

	const EntityItem = entity === "groups" ? GroupCard : PlayerCard;
	return (
		<Stack width="100%" direction="row" gap={2} flexWrap="wrap" justifyContent="center">
			{items.map((item) => {
				return <EntityItem entity={entity} item={item} key={item.id} />;
			})}
		</Stack>
	);
}

export function PlayerCard(props: { item: Player; entity: entityName }) {
	const { item, entity } = props;
	const firebaseApi = useFirebaseApi();

	const navigate = useNavigate();
	const entityData = getEntityData(entity);

	return (
		<Card sx={{ minWidth: 280, maxWidth: 320, width: "100%", position: "relative" }}>
			<CardHeader
				avatar={<Avatar>{parseInt(Math.random() * (99 - 50) + 50)}</Avatar>}
				action={
					<IconButton
						onClick={() => {
							// todo: remove player form groups
							firebaseApi.firesotre.deleteDocument({
								collectionName: entityData.collection,
								id: item.id,
							});
							item.image && firebaseApi.storage.deleteFile(item.image.fullPath);
						}}
					>
						<DeleteIcon />
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
					src={item.image?.url}
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

export function GroupCard(props: { item: Group; entity: entityName }) {
	const { entity, item } = props;

	const navigate = useNavigate();
	const entityData = getEntityData(entity);
	const firebaseApi = useFirebaseApi();
	return (
		<Card sx={{ maxWidth: 345 }}>
			<CardHeader
				avatar={<Avatar>S</Avatar>}
				action={
					<IconButton
						onClick={() => {
							firebaseApi.firesotre.deleteDocument({
								collectionName: entityData.collection,
								id: item.id,
							});
							item.image && firebaseApi.storage.deleteFile(item.image.fullPath);
						}}
					>
						<DeleteIcon />
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
				<CardMedia alt="" component="img" image={item.image?.url} height="200" />
				<CardContent>
					<Typography>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut quae laborum odio
						iste tempore provident ea impedit corporis, ut, maxime recusandae quasi suscipit
						voluptatem commodi odit corrupti quam totam distinctio!
					</Typography>
				</CardContent>
			</CardActionArea>
			<CardActions>
				<IconButton>
					<Favorite />
				</IconButton>
			</CardActions>
		</Card>
	);
}

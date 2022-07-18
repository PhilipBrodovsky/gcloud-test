import { useAppSelector } from "store";
import { useFirebaseApi } from "firebase-api";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

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

import { entityName, getEntityData } from "utils/entity";

import { Favorite, Menu, MoreVert } from "@mui/icons-material";
import { AppBarWithDrawer } from "components";

export function GroupCard(props: { group: Group }) {
	const { group } = props;

	const navigate = useNavigate();

	const firebaseApi = useFirebaseApi();
	return (
		<Card sx={{ maxWidth: 345, minWidth: 300 }}>
			<CardHeader
				avatar={<Avatar>G</Avatar>}
				action={
					<IconButton
						onClick={() => {
							firebaseApi.firesotre.deleteDocument({
								collectionName: "groups",
								id: group.id,
							});
							group.image && firebaseApi.storage.deleteFile(group.image.fullPath);
						}}
					>
						<DeleteIcon />
					</IconButton>
				}
				title={group.name}
			/>
			<CardActionArea
				onClick={() => {
					navigate(`${group.id}`);
				}}
			>
				<CardMedia alt="" component="img" image={group.image?.url} height="200" />
			</CardActionArea>
		</Card>
	);
}

export function GroupsPage() {
	const navigate = useNavigate();
	const groups = useAppSelector((state) => state.groups.list);

	return (
		<AppBarWithDrawer title="Groups" onBack={() => navigate("/")}>
			<Stack
				sx={{
					flexGrow: 1,
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
					{groups.map((group) => {
						return <GroupCard group={group} key={group.id} />;
					})}
				</Stack>
				<Fab
					onClick={() => navigate(`/groups/create`)}
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

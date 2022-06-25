import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import { useActions, useAppSelector } from "store";
import { CardActionArea } from "@mui/material";
import { useFirebaseApi } from "firebase-api";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useParams } from "react-router-dom";
import { Fab, Stack } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CardContent from "@mui/material/CardContent";
import { red } from "@mui/material/colors";

export function CyclesPage() {
	const navigate = useNavigate();
	const players = useAppSelector((state) => state.players.list);

	const actions = useActions();
	const params = useParams();
	const firebaseApi = useFirebaseApi();

	const cycles = useAppSelector((state) => state.cycles.map[params.groupId]);

	useEffect(() => {
		const unsubscribe = firebaseApi.firesotre.subscribeCollection({
			collectionName: `groups/${params.groupId}/cycles`,
			callback: (result) => {
				actions.dispatch(
					actions.cycles.set({
						groupId: params.groupId,
						cycles: result.items,
					})
				);
			},
		});
		return () => unsubscribe();
	}, [params.groupId]);

	if (!cycles) return null;

	return (
		<Stack id="EntityListPage" width="100%">
			<Stack width="100%" direction="row" gap={2} flexWrap="wrap" justifyContent="center">
				{cycles?.map((cycle: any) => {
					return (
						<Card key={cycle.id}>
							<CardHeader
								avatar={<Avatar sx={{ bgcolor: red[500] }}>R</Avatar>}
								action={
									<IconButton
										onClick={() => {
											firebaseApi.firesotre.deleteDocument({
												collectionName: `groups/${params.groupId}/cycles`,
												id: cycle.id,
											});
										}}
									>
										<DeleteIcon />
									</IconButton>
								}
								title={cycle.name}
								subheader={new Date(cycle.createDate).toDateString()}
							/>
							<CardActionArea
								onClick={() => {
									navigate(cycle.id);
								}}
							>
								<CardMedia component="img" image="/soccer.jpeg" height="120" />
							</CardActionArea>
							<CardContent>dsas</CardContent>
						</Card>
					);
				})}
			</Stack>
			<Fab
				onClick={() => navigate(`create`)}
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

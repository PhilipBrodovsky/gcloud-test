import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
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

import { Dialog } from "./view/Dialog";
import { Drawer } from "./view/Drawer";
import { Box } from "@mui/system";

import { initializeApp } from "firebase/app";

import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import { addDoc, collection, doc, getDocs, getFirestore, onSnapshot } from "firebase/firestore";
import {
	Outlet,
	Route,
	Routes,
	useLocation,
	useMatch,
	useNavigate,
	useParams,
} from "react-router-dom";
import { Page } from "./view/Page";
import { CardList } from "./view/CardList";

import AddIcon from "@mui/icons-material/Add";

import { CreateEntity } from "view/CreateEntity/CreateEntity";
import { entityName, getEntityData } from "utils/entity";
import { useFirebaseApi } from "firebase-api";
import { EntityList } from "view/EntityList/EntityList";

/**
 *   group
 *      cycles
 *          games
 *      players
 *
 */

const drawerWidth = 240;

function AppBarWithDrawer(props: any) {
	const { children, title, drawerContent } = props;

	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};
	return (
		<Stack direction="row">
			<AppBar
				sx={{
					ml: { sm: `${drawerWidth}px` },
					width: { sm: `calc(100% - ${drawerWidth}px)` },
				}}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: "none" } }}
					>
						<Menu />
					</IconButton>
					<Typography variant="h6" noWrap component="div">
						{title}
					</Typography>
				</Toolbar>
			</AppBar>
			<Box
				component="nav"
				sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
				aria-label="mailbox folders"
			>
				<Drawer content={drawerContent} open={mobileOpen} onClose={handleDrawerToggle} />
			</Box>
			<Stack alignItems="center" sx={{ width: `calc(100% - 240px)`, flexGrow: 1, p: 3 }}>
				<Toolbar />
				{children}
			</Stack>
		</Stack>
	);
}

function Layout() {
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};
	const navigate = useNavigate();
	return (
		<Stack direction="row">
			<AppBar
				sx={{
					ml: { sm: `${drawerWidth}px` },
					width: { sm: `calc(100% - ${drawerWidth}px)` },
				}}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: "none" } }}
					>
						<Menu />
					</IconButton>
					<Typography variant="h6" noWrap component="div">
						Soccer Manager
					</Typography>
				</Toolbar>
			</AppBar>
			<Box
				component="nav"
				sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
				aria-label="mailbox folders"
			>
				<Drawer
					open={mobileOpen}
					onClose={handleDrawerToggle}
					content={
						<List>
							{["Groups", "Players"].map((text, index) => (
								<ListItem key={text} disablePadding>
									<ListItemButton
										onClick={() => {
											console.log(text);
											navigate("/" + text.toLowerCase());
											handleDrawerToggle();
										}}
									>
										<ListItemIcon>
											{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
										</ListItemIcon>
										<ListItemText primary={text} />
									</ListItemButton>
								</ListItem>
							))}
						</List>
					}
				/>
			</Box>
			<Stack alignItems="center" sx={{ width: `calc(100% - 240px)`, flexGrow: 1, p: 3 }}>
				<Toolbar />
				<Outlet />
			</Stack>
		</Stack>
	);
}

function EntityPage() {
	const params = useParams<{ entity: entityName; id: string }>();
	const entityData = getEntityData(params.entity!);
	const navigate = useNavigate();
	const location = useLocation();
	const firebaseApi = useFirebaseApi();
	console.log(location);

	const content = {
		groups: {
			drawerContent: (
				<List>
					{["cycles", "players"].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton
								onClick={() => {
									console.log(text);
									navigate(location.pathname + "/" + text.toLowerCase());
								}}
							>
								<ListItemIcon>
									{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			),
		},
		players: {
			drawerContent: (
				<List>
					{["Groupss", "Playerss"].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton
								onClick={() => {
									console.log(text);
									navigate("/" + text.toLowerCase());
								}}
							>
								<ListItemIcon>
									{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			),
		},
	};

	const ui = content[params.entity!];
	return (
		<AppBarWithDrawer title="page" drawerContent={ui.drawerContent}>
			<Outlet />
		</AppBarWithDrawer>
	);
}

function EntitiesPage() {
	console.log("EntitiesPage");

	const { entity } = useParams<{ entity: entityName }>();
	const [entities, setEntities] = useState([]);
	const navigate = useNavigate();
	const firebaseApi = useFirebaseApi();
	const entityData = getEntityData(entity!);

	useEffect(() => {
		console.log(entityData);

		const unsub = firebaseApi.firesotre.subscribeCollection({
			collectionName: entityData.collection,
			callback: (res) => {
				console.log("res", res);

				setEntities(res.items);
			},
		});
		return () => unsub();
	}, [entity]);

	return (
		<Stack>
			<EntityList entity={entity} items={entities} />
			<Fab
				onClick={() => navigate(`${entityData.path}/create`)}
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

function Entity() {
	const params = useParams<{ entity: entityName; id: string }>();
	const entityData = getEntityData(params.entity!);
	const navigate = useNavigate();
	const location = useLocation();
	const firebaseApi = useFirebaseApi();
	console.log(location);

	const [item, setItem] = useState(null);

	useEffect(() => {
		const unsub = firebaseApi.firesotre.subscribeDoc({
			collectionName: entityData.collection,
			docId: params.id!,
			callback: (res) => {
				console.log("ress", res);
				setItem(res.item);
			},
		});
		return () => unsub();
	}, [params.entity]);

	const addCycle = () => {};

	if (!item) return null;

	console.log("====================================");
	console.log("entity", params, entityData);
	console.log("====================================");

	if (params.entity === "groups") {
		return (
			<Stack
				sx={{
					background: "red",
				}}
			>
				<GroupPage />
			</Stack>
		);
	}

	return (
		<Stack>
			<Button>{item.name}</Button>
		</Stack>
	);
}

function GroupPage() {
	return <div>group page</div>;
}

function App() {
	const [games, setGames] = useState([]);

	const [open, setOpen] = useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const addCycle = async () => {};

	async function getCycles() {
		// const snap = await getDocs(collection(firestore, "cycles"));
		// snap.forEach((doc) => {
		// 	console.log(doc.id, doc.data());
		// });
	}

	useEffect(() => {
		getCycles();
	}, []);

	return (
		<>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path=":entity">
						<Route index element={<EntitiesPage />} />
						<Route path="create" element={<CreateEntity />} />
					</Route>
					<Route element={<EntityPage />}>
						<Route path="/:entity/:id" element={<Entity />} />
					</Route>
				</Route>
			</Routes>
		</>
	);
}

export default App;

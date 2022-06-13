import {
	Outlet,
	Route,
	Routes,
	useLocation,
	useMatch,
	useNavigate,
	useParams,
} from "react-router-dom";

import { useFirebaseApi } from "firebase-api";
import { getEntityData } from "utils/entity";
import { List, ListItemText, ListItem, ListItemIcon, ListItemButton } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { AppBarWithDrawer } from "components";

export function EntityLayout() {

	const params = useParams<{ entity: entityName; id: string }>();
	const entityData = getEntityData(params.entity!);
	const navigate = useNavigate();
	const location = useLocation();
	const firebaseApi = useFirebaseApi();

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

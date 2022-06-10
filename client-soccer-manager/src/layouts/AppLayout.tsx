import { List, ListItemText, ListItem, ListItemIcon, ListItemButton } from "@mui/material";
import { AppBarWithDrawer } from "components";
import { Outlet, useNavigate } from "react-router-dom";

import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";

export function AppLayout() {
	const navigate = useNavigate();

	return (
		<AppBarWithDrawer
			title="Home"
			drawerContent={
				<List>
					{["Groups", "Players"].map((text, index) => (
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
			}
		>
			<Outlet />
		</AppBarWithDrawer>
	);
}

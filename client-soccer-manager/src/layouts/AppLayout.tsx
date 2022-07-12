import {
    List,
    ListItemText,
    ListItem,
    ListItemIcon,
    ListItemButton,
} from "@mui/material";
import { AppBarWithDrawer } from "components";
import { Outlet, useNavigate } from "react-router-dom";

import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { useActions } from "store";

export function AppLayout() {
    const navigate = useNavigate();
    const actions = useActions();

    return (
        <AppBarWithDrawer
            title="Soccer Manager"
            drawerContent={
                <List>
                    {["Groups", "Players"].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    actions.dispatch(actions.ui.closeSidebar());

                                    navigate("/" + text.toLowerCase());
                                }}
                            >
                                <ListItemIcon>
                                    {index % 2 === 0 ? (
                                        <InboxIcon />
                                    ) : (
                                        <MailIcon />
                                    )}
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

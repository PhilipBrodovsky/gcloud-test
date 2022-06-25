import { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { AppBar, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { Drawer } from "view/Drawer";

const drawerWidth = 240;

export function AppBarWithDrawer(props: any) {
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
						<MenuIcon />
					</IconButton>
					<IconButton sx={{ color: "white" }}>
						<ArrowBackIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div">
						{title}
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer content={drawerContent} open={mobileOpen} onClose={handleDrawerToggle} />
			<Stack sx={{ width: `calc(100% - 240px)`, flexGrow: 1, p: 2 }}>
				<Toolbar />
				{children}
			</Stack>
		</Stack>
	);
}

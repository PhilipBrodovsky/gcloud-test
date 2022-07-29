import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import { StoreContext } from "../bootstrap";
import { Avatar, Button, Menu, MenuItem, Tooltip } from "@mui/material";
import { useFirebaseApi } from "../firebase-api";
import { useContext, useState } from "react";

function UserMenu({ anchorEl, openMenu, closeMenu, user }: any) {
	const firebaseApi = useFirebaseApi();
	return (
		<Box sx={{ flexGrow: 0 }}>
			<Tooltip title="Open settings">
				<IconButton onClick={openMenu} sx={{ p: 0 }}>
					<Avatar alt="avatar" src={user.photoURL} />
				</IconButton>
			</Tooltip>
			<Menu
				sx={{ mt: "45px" }}
				id="menu-appbar"
				anchorEl={anchorEl}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				keepMounted
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				open={Boolean(anchorEl)}
				onClose={closeMenu}
			>
				{[{ label: "Logout", callback: firebaseApi.auth.logout }].map((setting) => (
					<MenuItem
						key={setting.label}
						onClick={() => {
							closeMenu();
							setting.callback();
						}}
					>
						<Typography textAlign="center">{setting.label}</Typography>
					</MenuItem>
				))}
			</Menu>
		</Box>
	);
}

export function AppBar(props: any) {
	const context = useContext(StoreContext);

	const { user, setUser } = context;

	const [anchorElUser, setAnchorElUser] = useState(null);

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};
	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const firebaseApi = useFirebaseApi();
	return (
		<Box sx={{ flexGrow: 1 }}>
			<MuiAppBar {...props}>
				<Toolbar>
					<IconButton
						size="large"
						edge="start"
						color="inherit"
						aria-label="open drawer"
						sx={{ mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
					>
						MUI
					</Typography>
					{user ? (
						<UserMenu
							user={user}
							anchorEl={anchorElUser}
							openMenu={handleOpenUserMenu}
							closeMenu={handleCloseUserMenu}
						/>
					) : (
						<Button
							variant="contained"
							onClick={async () => {
								firebaseApi.auth.googleLogin().then((user) => context.setUser(user));
							}}
						>
							Login
						</Button>
					)}
				</Toolbar>
			</MuiAppBar>
		</Box>
	);
}

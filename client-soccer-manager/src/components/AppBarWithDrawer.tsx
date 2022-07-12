import { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { AppBar, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import { Drawer } from "view/Drawer";
import { useActions, useAppSelector } from "store";

const drawerWidth = 240;

export function AppBarWithDrawer(props: any) {
    const { children, title, drawerContent, onBack } = props;

    const sidebar = useAppSelector((state) => state.ui.sidebar);
    const actions = useActions();

    const handleDrawerClose = () => {
        actions.dispatch(actions.ui.closeSidebar());
    };
    return (
        <Stack direction="row" flexGrow={1}>
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
                        onClick={() =>
                            actions.dispatch(actions.ui.openSidebar())
                        }
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {onBack && (
                        <IconButton onClick={onBack} sx={{ color: "white" }}>
                            <ArrowBackIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" noWrap component="div">
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                content={drawerContent}
                open={sidebar.isOpen}
                onClose={handleDrawerClose}
            />
            <Stack sx={{ width: `calc(100% - 240px)`, flexGrow: 1 }}>
                <Toolbar />
                {children}
            </Stack>
        </Stack>
    );
}

import { useEffect, useState } from "react";
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
    IconButton,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import { Favorite, MoreVert } from "@mui/icons-material";

import { Box } from "@mui/system";

import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { Route, Routes } from "react-router-dom";

export function Page() {
    const [games, setGames] = useState([]);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Stack>
            <RenderCards />
        </Stack>
    );
}

function RenderCards() {
    return null;
}

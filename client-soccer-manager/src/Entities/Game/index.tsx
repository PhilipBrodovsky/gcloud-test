import {
	CardHeader,
	Card,
	CardContent,
	Stack,
	Typography,
	Button,
	IconButton,
} from "@mui/material";

import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import HdrAutoIcon from "@mui/icons-material/HdrAuto";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import { useEffect, useRef, useState } from "react";
import { useFirebaseApi } from "firebase-api";
import { useLocation } from "react-router-dom";

export * from "./GamesPage";
export * from "./Game";
export * from "./CreateGame";
export * from "./GamePage";

import { Game } from "./Game";

interface Props {
	game: Game;
}

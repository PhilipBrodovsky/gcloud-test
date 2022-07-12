import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useActions, useAppSelector } from "store";
import {
    Button,
    CardActionArea,
    Divider,
    Stack,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import { Field } from "view/CreateEntity/CreateEntity";
import { useEffect, useState } from "react";
import { useFirebaseApi } from "firebase-api";

import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useCycleGames } from "hooks";
import { AppBarWithDrawer } from "components";

import LoopIcon from "@mui/icons-material/Loop";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Game } from "Entities";

type Team = string[];

export interface Cycle {
    id: string;
    name: string;
    image?: {
        url: string;
        bucket: string;
        fullPath: string;
        name: string;
    };
    players: string[];
    teams: Team[];
}

export const useCycleForm = () => {
    const players = useAppSelector((state) => state.players.list);
    const fields = [
        { name: "name", label: "Name", defaultValue: "" },
        { name: "image", label: "Image", type: "file", defaultValue: "" },

        {
            name: "players",
            label: "Players",
            type: "select",
            list: players.map((p) => ({ label: p.name, value: p.id })),
            emptyValue: [],
            selectProps: { multiple: true },
        },
    ];
    return { fields };
};

interface Props {}

export const CyclePage = (props: Props) => {
    const params = useParams<{ cycleId: string; groupId: string }>();
    const players = useAppSelector((state) => state.players.list);
    const cycles = useAppSelector((state) => state.cycles.map[params.groupId!]);
    const cycle = cycles?.find((c) => c.id === params.cycleId) as Cycle;

    const groupForm = useCycleForm();

    const firebaseApi = useFirebaseApi();
    const navigate = useNavigate();

    const actions = useActions();

    const location = useLocation();

    const games = useCycleGames(cycle?.id);

    console.log("cycle", cycle);
    console.log("games", games);

    function createData(
        name: string,
        games: string,
        goals: number,
        wins: number,
        penaltyWin: number,
        loses: number
    ) {
        return { name, games, goals, wins, penaltyWin, loses };
    }

    const totalGamaes1 = games.filter(
        (game: Game) =>
            game.teamTwo.name === "team1" || game.teamOne.name === "team1"
    );
    const totalGamaes3 = games.filter(
        (game: Game) =>
            game.teamTwo.name === "team3" || game.teamOne.name === "team3"
    );
    const totalGamaes2 = games.filter(
        (game: Game) =>
            game.teamTwo.name === "team2" || game.teamOne.name === "team2"
    );
    const totalGoals1 = totalGamaes1?.reduce((acc, game: Game) => {
        console.log("GG", acc);
        if (game.teamTwo.name === "team1") {
            const goals = Object.values(game.teamTwo.players).reduce(
                (acc, player) => (acc += player.goals),
                0
            );
            acc += goals;
            return acc;
        } else {
            const goals = Object.values(game.teamOne.players).reduce(
                (acc, player) => (acc += player.goals),
                0
            );
            acc += goals;
            return acc;
        }
    }, 0);
    const totalGoals2 = totalGamaes2?.reduce((acc, game: Game) => {
        console.log("GG", acc);
        if (game.teamTwo.name === "team2") {
            const goals = Object.values(game.teamTwo.players).reduce(
                (acc, player) => (acc += player.goals),
                0
            );
            acc += goals;
            return acc;
        } else {
            const goals = Object.values(game.teamOne.players).reduce(
                (acc, player) => (acc += player.goals),
                0
            );
            acc += goals;
            return acc;
        }
    }, 0);
    const totalGoals3 = totalGamaes3?.reduce((acc, game: Game) => {
        console.log("GG", acc);
        if (game.teamTwo.name === "team3") {
            const goals = Object.values(game.teamTwo.players).reduce(
                (acc, player) => (acc += player.goals),
                0
            );
            acc += goals;
            return acc;
        } else {
            const goals = Object.values(game.teamOne.players).reduce(
                (acc, player) => (acc += player.goals),
                0
            );
            acc += goals;
            return acc;
        }
    }, 0);

    console.log("totalGamaes", totalGamaes1, totalGamaes2, totalGamaes3);
    console.log("total goals", totalGoals1, totalGoals1, totalGoals1);

    useEffect(() => {
        if (!cycle?.id) {
            const unsubscribe = firebaseApi.firesotre.subscribeDoc({
                collectionName: `groups/${params.groupId}/cycles`,
                docId: params.cycleId,
                callback: (result) => {
                    actions.dispatch(
                        actions.cycles.set({
                            groupId: params.groupId,
                            cycles: [result.item],
                        })
                    );
                },
            });
            return;
        }

        const unsubscribe = firebaseApi.firesotre.subscribeCollection({
            collectionName: `groups/${params.groupId}/cycles/${cycle.id}/games`,
            callback: (result) => {
                actions.dispatch(
                    actions.games.set({
                        cycleId: cycle.id,
                        games: result.items,
                    })
                );
            },
        });
        return () => unsubscribe();
    }, [cycle?.id]);

    if (!cycle) return null;

    const createGame = async () => {
        const res = await firebaseApi.firesotre.createDoc({
            collectionName: `groups/${params.id}/cycles/${cycle.id}/games`,
            data: { name: "new game" },
        });
    };

    const randomTeams = () => {
        const players = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        const teams = [[], [], []];
    };

    const teams = [
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5],
        [1, 2, 3, 4, 5],
    ];

    return (
        <AppBarWithDrawer
            title="Cicle"
            onBack={() =>
                navigate(
                    window.location.pathname.substring(
                        0,
                        window.location.pathname.lastIndexOf("/")
                    )
                )
            }
            drawerContent={
                <List>
                    {["Games"].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    actions.dispatch(actions.ui.closeSidebar());

                                    navigate(text.toLowerCase());
                                }}
                            >
                                <ListItemIcon>
                                    <LoopIcon />
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            }
        >
            <Card sx={{ width: "100%" }}>
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table sx={{}} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>team1</TableCell>
                                    <TableCell>team2</TableCell>
                                    <TableCell>team3</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>games</TableCell>
                                    <TableCell>{totalGamaes1.length}</TableCell>
                                    <TableCell>{totalGamaes2.length}</TableCell>
                                    <TableCell>{totalGamaes3.length}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>goals</TableCell>
                                    <TableCell>{totalGoals1}</TableCell>
                                    <TableCell>{totalGoals2}</TableCell>
                                    <TableCell>{totalGoals3}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>goal/game</TableCell>
                                    <TableCell>
                                        {(
                                            totalGoals1 / totalGamaes1.length
                                        ).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {(
                                            totalGoals2 / totalGamaes2.length
                                        ).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        {(
                                            totalGoals3 / totalGamaes3.length
                                        ).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </AppBarWithDrawer>
    );
};

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
    const cycle = cycles?.find((c) => c.id === params.cycleId);

    const groupForm = useCycleForm();

    const firebaseApi = useFirebaseApi();
    const navigate = useNavigate();

    const actions = useActions();

    const location = useLocation();

    const games = useCycleGames(cycle?.id);

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
                    <Typography variant="body2" color="text.secondary">
                        games: 10
                    </Typography>
                    <Divider sx={{ my: 2 }} />

                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        gap={2}
                        justifyContent="center"
                    >
                        {teams.map((team, i) => {
                            return (
                                <Card sx={{ minWidth: 300 }}>
                                    <CardHeader
                                        title={`Team ${i}`}
                                        subheader="wins: 3"
                                    />
                                    <CardContent>
                                        <Stack gap={2}>
                                            {team.map((player) => {
                                                return (
                                                    <Stack
                                                        gap={1}
                                                        alignItems="center"
                                                        direction="row"
                                                    >
                                                        <Avatar>
                                                            {player}
                                                        </Avatar>
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                        >
                                                            player: {player}
                                                        </Typography>
                                                    </Stack>
                                                );
                                            })}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Stack>

                    <Divider sx={{ my: 2 }} />
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography variant="h4">Games</Typography>
                        <Button onClick={randomTeams} variant="contained">
                            Random Teams
                        </Button>
                        <Button onClick={createGame} variant="contained">
                            Create
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </AppBarWithDrawer>
    );
};

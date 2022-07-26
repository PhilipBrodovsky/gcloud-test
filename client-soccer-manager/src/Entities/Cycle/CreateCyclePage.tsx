import {
    CardContent,
    Stack,
    Card,
    Avatar,
    Typography,
    CardHeader,
    Button,
    Container,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "store";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Checkbox from "@mui/material/Checkbox";
import React, { useEffect, useState } from "react";
import { Field } from "view/CreateEntity/CreateEntity";
import { useFirebaseApi } from "firebase-api";
import { AppBarWithDrawer } from "components";
import { Cycle, CyclePlayer } from "./Cycle";
import { Group } from "Entities/Group/Group";

type Team = string[];

const fields = [];

export const CreateCyclePage = () => {
    const params = useParams<{ groupId: string }>();

    const group = useAppSelector((state) =>
        state.groups.list.find((g) => g.id === params.groupId)
    ) as Group;
    const players = useAppSelector((state) => state.players.list);

    const navigate = useNavigate();

    const firebaseApi = useFirebaseApi();

    const [form, setForm] = useState<Omit<Cycle, "id">>({
        numberOfTeams: group?.numberOfTeams,
        playersPerTeam: group?.playersPerTeam,
        players: [],
        createDate: 0,
        teams: {},
    });
    console.log(group);
    console.log(form);

    useEffect(() => {
        setForm({
            ...form,
            numberOfTeams: group?.numberOfTeams,
            playersPerTeam: group?.playersPerTeam,
        });
    }, [group]);

    useEffect(() => {
        const teams = new Array(Number(form.numberOfTeams || 0))
            .fill(0)
            .reduce((acc, _, i) => {
                acc["team" + (i + 1)] = { color: "", id: "team" + (i + 1) };
                return acc;
            }, {});
        setForm({
            ...form,
            teams,
        });
    }, [form.numberOfTeams]);

    console.log("teams", form.teams);

    const handleToggle =
        (playerId: string, teamId: string) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const checked = event.target.checked;

            setForm({
                ...form,
                players: form.players.map((player) =>
                    player.playerId === playerId
                        ? { ...player, teamId: checked ? teamId : "" }
                        : player
                ),
            });
        };

    const [selectedPlayers, setSelectedPlayers] = useState([]);

    const createForm = async () => {
        const res = await firebaseApi.firesotre.createDoc({
            collectionName: `groups/${group?.id}/cycles`,
            data: { ...form, createDate: new Date().getTime() },
        });
        navigate(-1);
    };

    if (!group) return null;

    return (
        <AppBarWithDrawer title="Create Cycle">
            <Container>
                <Stack width={"100%"} p={2} gap={4}>
                    <Field
                        onChange={(name, value) =>
                            setForm({ ...form, [name]: value })
                        }
                        value={form.numberOfTeams}
                        field={{
                            name: "numberOfTeams",
                            label: "Number of teams",
                            type: "number",
                            defaultValue: group?.numberOfTeams,
                        }}
                    />
                    <Field
                        value={form.playersPerTeam}
                        onChange={(name, value) =>
                            setForm({ ...form, [name]: value })
                        }
                        field={{
                            name: "playersPerTeam",
                            label: "Players per team",
                            type: "number",
                            defaultValue: group?.playersPerTeam,
                        }}
                    />
                    <Field
                        onChange={(_, value) => {
                            setSelectedPlayers(value);
                            setForm({
                                ...form,
                                players: value.map(
                                    (id: string): CyclePlayer => {
                                        return { playerId: id, teamId: "" };
                                    }
                                ),
                            });
                        }}
                        value={selectedPlayers}
                        field={{
                            name: "players",
                            label: "Players",
                            type: "select",
                            list: group.players.map((pId) => {
                                const p = players.find((p) => p.id == pId);
                                return {
                                    label: p?.name || "",
                                    value: p?.id || "",
                                };
                            }),
                            defaultValue: [],
                            selectProps: { multiple: true },
                        }}
                    />
                    <Stack gap={1}>
                        {Object.values(form.teams || {}).map((team) => {
                            console.log(team, "team");

                            return (
                                <Stack
                                    alignItems={"center"}
                                    direction="row"
                                    gap={2}
                                >
                                    <Typography>{team.id}</Typography>
                                    <input
                                        onChange={(event) => {
                                            console.log(
                                                team.id,
                                                event.target.value
                                            );
                                            const newTeams = {
                                                ...form.teams,
                                                [team.id]: {
                                                    id: team.id,
                                                    color: event.target.value,
                                                },
                                            };
                                            setForm({
                                                ...form,
                                                teams: newTeams,
                                            });
                                        }}
                                        type="color"
                                        id="body"
                                        name="body"
                                        value={team.color}
                                    />
                                </Stack>
                            );
                        })}
                    </Stack>
                    <List
                        disablePadding
                        dense
                        sx={{
                            width: "100%",
                            maxWidth: 300,
                            bgcolor: "lightgray",
                        }}
                        subheader="Teams"
                    >
                        <ListItem
                            secondaryAction={
                                <>
                                    <Checkbox edge="end" checked={true} />
                                    <Checkbox
                                        edge="end"
                                        checked={true}
                                        sx={{ color: "black" }}
                                    />
                                    <Checkbox
                                        edge="end"
                                        checked={true}
                                        color="success"
                                    />
                                </>
                            }
                            disablePadding
                        >
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar sx={{ width: 30, height: 30 }}>
                                        T
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={`teams`} />
                            </ListItemButton>
                        </ListItem>
                        {form.players.map((player, i) => {
                            const colors = {
                                team1: "blue",
                                team2: "orange",
                                team3: "green",
                            };

                            const color = colors.team1;
                            return (
                                <ListItem
                                    key={player.playerId}
                                    secondaryAction={
                                        <>
                                            {Object.values(form.teams).map(
                                                (team) => {
                                                    return (
                                                        <Checkbox
                                                            sx={{
                                                                color: team.color,
                                                                "&.Mui-checked":
                                                                    {
                                                                        color: team.color,
                                                                    },
                                                            }}
                                                            edge="end"
                                                            onChange={handleToggle(
                                                                player.playerId,
                                                                team.id
                                                            )}
                                                            checked={
                                                                player.teamId ===
                                                                team.id
                                                            }
                                                        />
                                                    );
                                                }
                                            )}
                                        </>
                                    }
                                    disablePadding
                                >
                                    <ListItemButton>
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{ width: 30, height: 30 }}
                                                src={player?.image?.url}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            id={player.playerId}
                                            sx={{ color: color }}
                                            primary={`${i} ${
                                                players.find(
                                                    (p) =>
                                                        p.id === player.playerId
                                                )?.name
                                            }`}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                    <Button onClick={createForm} variant="contained">
                        Create
                    </Button>
                </Stack>
            </Container>
        </AppBarWithDrawer>
    );
};

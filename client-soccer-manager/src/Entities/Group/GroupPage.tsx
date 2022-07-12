import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import { useFirebaseApi } from "firebase-api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Group } from "./Group";
import { AppBarWithDrawer } from "components";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Divider,
    Button,
} from "@mui/material";
import { Field } from "view/CreateEntity/CreateEntity";

import MailIcon from "@mui/icons-material/Mail";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { useActions, useAppSelector } from "store";

export const useGroupForm = () => {
    const players = useAppSelector((state) => state.players.list);

    const fields = [
        { name: "name", label: "Name", defaultValue: "" },
        { name: "image", label: "Image", type: "file", defaultValue: "" },
        {
            name: "numberOfTeams",
            label: "Number of teams",
            type: "number",
            defaultValue: 0,
        },
        {
            name: "playersPerTeam",
            label: "Players per team",
            type: "number",
            defaultValue: 0,
        },

        {
            name: "players",
            label: "Players",
            type: "select",
            list: players.map((p) => ({ label: p.name, value: p.id })),
            defaultValue: [],
            selectProps: { multiple: true },
        },
    ];
    return { fields };
};

export const GroupPage = () => {
    const [group, setGroup] = useState<Group | null>(null);
    const groupForm = useGroupForm();

    const firebaseApi = useFirebaseApi();
    const navigate = useNavigate();

    const params = useParams<{ groupId: string }>();
    const actions = useActions();

    useEffect(() => {
        if (!params?.groupId) return;

        firebaseApi.firesotre.subscribeDoc({
            collectionName: "groups",
            docId: params?.groupId,
            callback: (res) => setGroup(res.item),
        });
    }, [params?.groupId]);

    if (!group) return null;

    console.log("group", group);

    return (
        <AppBarWithDrawer
            title="Group"
            onBack={() => navigate("/groups")}
            drawerContent={
                <List>
                    {["Cycles"].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    actions.dispatch(actions.ui.closeSidebar());

                                    navigate(text.toLowerCase());
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
            <Card sx={{ p: 2, m: 2 }}>
                <CardHeader
                    avatar={<Avatar sx={{ bgcolor: red[500] }}>R</Avatar>}
                    action={
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={group.name}
                    subheader={new Date().toDateString()}
                />
                <CardMedia
                    component="img"
                    height="300px"
                    image={group.image?.url}
                    alt="Paella dish"
                />
                <CardContent>
                    <Stack gap={4}>
                        <Field
                            value={group.numberOfTeams}
                            field={{
                                name: "numberOfTeams",
                                label: "Number of teams",
                                type: "number",
                            }}
                        />
                        <Field
                            value={group.playersPerTeam}
                            field={{
                                name: "playersPerTeam",
                                label: "Players per team",
                                type: "number",
                            }}
                        />
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <Field
                        value={group?.players || []}
                        onChange={(_, newPlayers) => {
                            firebaseApi.firesotre.updateDocument({
                                collectionName: "groups",
                                id: group.id,
                                data: { players: newPlayers },
                            });
                        }}
                        field={groupForm.fields.find(
                            (f) => f.name === "players"
                        )}
                        fullWidth
                    />
                    <Button
                        sx={{ margin: "auto" }}
                        onClick={() => {
                            navigate("cycles");
                        }}
                    >
                        Go to cycles
                    </Button>
                </CardContent>
            </Card>
        </AppBarWithDrawer>
    );
};

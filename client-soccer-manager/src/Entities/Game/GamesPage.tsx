import {
    Badge,
    Button,
    Card,
    CardActions,
    CardContent,
    Fab,
    Stack,
    Typography,
} from "@mui/material";
import { AppBarWithDrawer } from "components";
import { useFirebaseApi } from "firebase-api";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useActions, useAppSelector } from "store";
import AddIcon from "@mui/icons-material/Add";
import { Game } from "./Game";
import { orderBy } from "firebase/firestore";

export const GamesPage = () => {
    const { cycleId, groupId } = useParams<{
        cycleId: string;
        groupId: string;
    }>();

    const games = useAppSelector(
        (state) => state.games.map[cycleId!]
    ) as Game[];

    console.log("====================================");
    console.log("games", games);
    console.log("====================================");
    const firebaseApi = useFirebaseApi();
    const actions = useActions();

    const navigate = useNavigate();

    useEffect(() => {
        firebaseApi.firesotre.subscribeCollection({
            collectionName: `groups/${groupId}/cycles/${cycleId}/games`,
            order: orderBy("createDate", "desc"),
            callback: (result) => {
                console.log("result", result);
                actions.dispatch(
                    actions.games.set({
                        cycleId: cycleId!,
                        games: result.items,
                    })
                );
            },
        });
    }, [cycleId]);

    if (!games) return null;

    return (
        <AppBarWithDrawer
            onBack={() =>
                navigate(
                    window.location.pathname.substring(
                        0,
                        window.location.pathname.lastIndexOf("/")
                    )
                )
            }
            title="games"
        >
            <Stack margin={2} sx={{ backgroundColor: "lightgray" }} gap={2}>
                {games.map((game) => {
                    console.log(game.winner, "WIN");

                    const goals1 = Object.values(game.teamOne.players).reduce(
                        (acc, player) => (acc += player.goals),
                        0
                    );
                    const goals2 = Object.values(game.teamTwo.players).reduce(
                        (acc, player) => (acc += player.goals),
                        0
                    );
                    const winnertTeam =
                        goals1 > goals2 || game.teamOne.name === game.winner
                            ? game.teamOne
                            : goals2 > goals1 ||
                              game.teamTwo.name === game.winner
                            ? game.teamTwo
                            : null;
                    return (
                        <Card
                            sx={{
                                background:
                                    game.status === "active" && "lightgreen",
                            }}
                        >
                            <CardContent onClick={() => navigate(game.id)}>
                                <Typography textAlign={"end"} variant="caption">
                                    {game.status}
                                </Typography>
                                <Stack
                                    alignItems={"center"}
                                    width={"100%"}
                                    direction={"row"}
                                    justifyContent={"space-between"}
                                >
                                    <Typography
                                        color={
                                            game.teamOne === winnertTeam
                                                ? "primary"
                                                : undefined
                                        }
                                        variant="h4"
                                    >
                                        {game.teamOne.name}
                                    </Typography>
                                    <Typography> vs</Typography>
                                    <Typography
                                        color={
                                            game.teamTwo === winnertTeam
                                                ? "primary"
                                                : undefined
                                        }
                                        variant="h4"
                                    >
                                        {game.teamTwo.name}
                                    </Typography>
                                </Stack>
                                <Typography variant="h3">
                                    {goals1} - {goals2}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button>Remove</Button>
                                <Button>edit</Button>
                            </CardActions>
                        </Card>
                    );
                })}
            </Stack>
            <Fab
                onClick={() => navigate(`create`)}
                color="primary"
                aria-label="add"
                sx={{
                    position: "fixed",
                    bottom: 16,
                    right: 16,
                }}
            >
                <AddIcon />
            </Fab>
        </AppBarWithDrawer>
    );
};

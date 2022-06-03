import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
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

import { Dialog } from "./view/Dialog";
import { Drawer } from "./view/Drawer";
import { Box } from "@mui/system";

import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { Route, Routes } from "react-router-dom";
import { Page } from "./view/Page";
import { CardList } from "./view/CardList";

const app = initializeApp({
    apiKey: "AIzaSyClGm6kruNdLaUPqBnBqa-IZFbnpxsgIow",
    authDomain: "easylife-55a85.firebaseapp.com",
    projectId: "easylife-55a85",
    storageBucket: "easylife-55a85.appspot.com",
    messagingSenderId: "1594199736",
    appId: "1:1594199736:web:82b1ed2303cabc5c736e4d",
    measurementId: "G-SDC1X4CNY1",
});

/**
 *   group
 *      cycles
 *          games
 *      players
 *
 */

const firestore = getFirestore(app);

function App() {
    const [games, setGames] = useState([]);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const addCycle = async () => {
        const docRef = await addDoc(collection(firestore, "cycles"), {
            date: new Date().getTime(),
            name: "cycle 1",
        });

        console.log(docRef, docRef.id);
    };

    async function getCycles() {
        const snap = await getDocs(collection(firestore, "cycles"));
        snap.forEach((doc) => {
            console.log(doc.id, doc.data());
        });
    }

    useEffect(() => {
        getCycles();
    }, []);

    return (
        <>
            <Drawer />

            <Box
                sx={{
                    width: { sm: `calc(100% - ${240}px)` },
                }}
                className="App"
            >
                <Toolbar />
                <Dialog open={open} handleClose={handleClose} />
                <AppBar>
                    <Toolbar>
                        <Button
                            onClick={handleClickOpen}
                            color="secondary"
                            variant="contained"
                        >
                            ADD
                        </Button>
                    </Toolbar>
                </AppBar>
                <Routes>
                    <Route path="groups">
                        <Route
                            index
                            element={
                                <CardList
                                    data={[1, 2, 3]}
                                    renderCard={(card) => {
                                        return (
                                            <Card sx={{ maxWidth: 345 }}>
                                                <CardHeader
                                                    avatar={<Avatar>S</Avatar>}
                                                    action={
                                                        <IconButton>
                                                            <MoreVert />
                                                        </IconButton>
                                                    }
                                                    title="Soccer"
                                                    subheader={new Date().toDateString()}
                                                />
                                                <CardActionArea>
                                                    <CardMedia
                                                        alt=""
                                                        component="img"
                                                        image="/soccer.jpeg"
                                                        height="200"
                                                    />
                                                    <CardContent>
                                                        <Typography>
                                                            Lorem ipsum dolor
                                                            sit amet consectetur
                                                            adipisicing elit.
                                                            Aut quae laborum
                                                            odio iste tempore
                                                            provident ea impedit
                                                            corporis, ut, maxime
                                                            recusandae quasi
                                                            suscipit voluptatem
                                                            commodi odit
                                                            corrupti quam totam
                                                            distinctio!
                                                        </Typography>
                                                    </CardContent>
                                                    ƒ
                                                </CardActionArea>
                                                <CardActions>
                                                    <IconButton>
                                                        <Favorite />
                                                    </IconButton>
                                                </CardActions>
                                            </Card>
                                        );
                                    }}
                                />
                            }
                        />
                        <Route path=":id" element={<Page />} />
                    </Route>
                    <Route path="players" element={<Page />} />
                    <Route
                        path="/"
                        element={
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                justifyContent="center"
                                gap={2}
                                p={2}
                                m={2}
                            >
                                {games.map((game) => {
                                    return (
                                        <Card sx={{ maxWidth: 345 }}>
                                            <CardHeader
                                                avatar={<Avatar>S</Avatar>}
                                                action={
                                                    <IconButton>
                                                        <MoreVert />
                                                    </IconButton>
                                                }
                                                title="Soccer"
                                                subheader={new Date().toDateString()}
                                            />
                                            <CardActionArea>
                                                <CardMedia
                                                    alt=""
                                                    component="img"
                                                    image="/soccer.jpeg"
                                                    height="200"
                                                />
                                                <CardContent>
                                                    <Typography>
                                                        Lorem ipsum dolor sit
                                                        amet consectetur
                                                        adipisicing elit. Aut
                                                        quae laborum odio iste
                                                        tempore provident ea
                                                        impedit corporis, ut,
                                                        maxime recusandae quasi
                                                        suscipit voluptatem
                                                        commodi odit corrupti
                                                        quam totam distinctio!
                                                    </Typography>
                                                </CardContent>
                                                ƒ
                                            </CardActionArea>
                                            <CardActions>
                                                <IconButton>
                                                    <Favorite />
                                                </IconButton>
                                            </CardActions>
                                        </Card>
                                    );
                                })}
                            </Stack>
                        }
                    />
                </Routes>
            </Box>
        </>
    );
}

export default App;

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
    CssBaseline,
    Fab,
    IconButton,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import { Favorite, Menu, MoreVert } from "@mui/icons-material";

import { Dialog } from "./view/Dialog";
import { Drawer } from "./view/Drawer";
import { Box } from "@mui/system";

import { initializeApp } from "firebase/app";

import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import {
    addDoc,
    collection,
    doc,
    getDocs,
    getFirestore,
    onSnapshot,
} from "firebase/firestore";
import {
    Outlet,
    Route,
    Routes,
    useNavigate,
    useParams,
} from "react-router-dom";
import { Page } from "./view/Page";
import { CardList } from "./view/CardList";

import AddIcon from "@mui/icons-material/Add";

import { CreateEntity } from "view/CreateEntity/CreateEntity";
import { entityName, getEntityData } from "utils/entity";
import { useFirebaseApi } from "firebase-api";
import { EntityList } from "view/EntityList/EntityList";

/**
 *   group
 *      cycles
 *          games
 *      players
 *
 */

const drawerWidth = 240;

function AppBarWithDrawer(props: any) {
    const { children, title, drawerContent } = props;

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    return (
        <Stack direction="row">
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
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    content={drawerContent}
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                />
            </Box>
            <Stack
                alignItems="center"
                sx={{ width: `calc(100% - 240px)`, flexGrow: 1, p: 3 }}
            >
                <Toolbar />
                {children}
            </Stack>
        </Stack>
    );
}

function Layout() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const navigate = useNavigate();
    return (
        <Stack direction="row">
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
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Soccer Manager
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    content={
                        <List>
                            {["Groups", "Players"].map((text, index) => (
                                <ListItem key={text} disablePadding>
                                    <ListItemButton
                                        onClick={() => {
                                            console.log(text);
                                            navigate("/" + text.toLowerCase());
                                            handleDrawerToggle();
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
                />
            </Box>
            <Stack
                alignItems="center"
                sx={{ width: `calc(100% - 240px)`, flexGrow: 1, p: 3 }}
            >
                <Toolbar />
                <Outlet />
            </Stack>
        </Stack>
    );
}

function EntityPage() {
    const params = useParams();
    console.log("params", params);
    const navigate = useNavigate();

    return (
        <AppBarWithDrawer
            title="page"
            drawerContent={
                <List>
                    {["Groupss", "Playerss"].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    console.log(text);
                                    navigate("/" + text.toLowerCase());
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
            <Outlet />
        </AppBarWithDrawer>
    );
}

function EntitiesPage() {
    console.log("EntitiesPage");

    const { entity } = useParams<{ entity: entityName }>();
    const [entities, setEntities] = useState([]);
    const navigate = useNavigate();
    const firebaseApi = useFirebaseApi();
    const entityData = getEntityData(entity!);

    useEffect(() => {
        console.log(entityData);

        const unsub = firebaseApi.firesotre.subscribeCollection({
            collectionName: entityData.collection,
            callback: (res) => {
                console.log("res", res);

                setEntities(res.items);
            },
        });
        return () => unsub();
    }, [entity]);

    return (
        <Stack>
            <EntityList entity={entity} items={entities} />
            <Fab
                onClick={() => navigate(`${entityData.path}/create`)}
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
        </Stack>
    );
}

function Entity() {
    const addCycle = () => {};
    return (
        <Stack>
            <Button>add cycle</Button>
        </Stack>
    );
}

function App() {
    const [games, setGames] = useState([]);

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const addCycle = async () => {};

    async function getCycles() {
        // const snap = await getDocs(collection(firestore, "cycles"));
        // snap.forEach((doc) => {
        // 	console.log(doc.id, doc.data());
        // });
    }

    useEffect(() => {
        getCycles();
    }, []);

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path=":entity">
                        <Route index element={<EntitiesPage />} />
                        <Route path="create" element={<CreateEntity />} />
                    </Route>
                    <Route element={<EntityPage />}>
                        <Route path="/:entity/:id" element={<Entity />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );

    return (
        <>
            <CssBaseline />
            <Dialog open={open} handleClose={handleClose} />
            <AppBar
                sx={{
                    ml: { sm: `${drawerWidth}px` },
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
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

            <Box
                sx={{
                    display: "flex",
                }}
                className="App"
            >
                <Box
                    component="nav"
                    sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    <Drawer />
                </Box>
                <Stack sx={{ width: `calc(100% - 240px)`, flexGrow: 1, p: 3 }}>
                    <Toolbar />
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
                                                        avatar={
                                                            <Avatar>S</Avatar>
                                                        }
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
                                                                Lorem ipsum
                                                                dolor sit amet
                                                                consectetur
                                                                adipisicing
                                                                elit. Aut quae
                                                                laborum odio
                                                                iste tempore
                                                                provident ea
                                                                impedit
                                                                corporis, ut,
                                                                maxime
                                                                recusandae quasi
                                                                suscipit
                                                                voluptatem
                                                                commodi odit
                                                                corrupti quam
                                                                totam
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
                </Stack>
            </Box>
        </>
    );
}

export default App;

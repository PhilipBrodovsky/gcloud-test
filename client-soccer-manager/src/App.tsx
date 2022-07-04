import { CreateEntity } from "view/CreateEntity/CreateEntity";
import { AppLayout } from "layouts";
import { HomePage } from "pages";

import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useFirebaseApi } from "firebase-api";
import { useActions } from "store";
import {
	CreateGame,
	CreateGroupPage,
	GamePage,
	GamesPage,
	GroupPage,
	GroupsPage,
	PlayerPage,
	PlayersPage,
} from "Entities";
import { CyclesPage } from "Entities/Cycle/CyclesPage";
import { CyclePage } from "Entities/Cycle/CyclePage";
import { CreateCyclePage } from "Entities/Cycle";
import { CreatePlayer } from "Entities/Player/CreatePlayer";

function App() {
	const firebaseApi = useFirebaseApi();
	const actions = useActions();

	useEffect(() => {
		init();
		async function init() {
			firebaseApi.firesotre.subscribeCollection({
				collectionName: "players",
				callback: (res) => {
					actions.dispatch(actions.players.set(res.items));
				},
			});
			firebaseApi.firesotre.subscribeCollection({
				collectionName: "groups",
				callback: (res) => {
					actions.dispatch(actions.groups.set(res.items));
				},
			});
		}
	}, []);
	return (
		<>
			<Routes>
				<Route path="/" element={<AppLayout />}>
					<Route index element={<HomePage />} />
					<Route path="players" element={<PlayersPage />} />
					<Route path="players/create" element={<CreatePlayer />} />
					<Route path="players/:id" element={<PlayerPage />} />
					<Route path="groups" element={<GroupsPage />} />
					<Route path="groups/:groupId/cycles/create" element={<CreateCyclePage />} />
				</Route>
				<Route path="groups/create" element={<CreateGroupPage />} />
				<Route path="groups/:groupId" element={<GroupPage />} />
				<Route path="groups/:groupId/cycles" element={<CyclesPage />} />
				<Route path="groups/:groupId/cycles/:cycleId" element={<CyclePage />} />
				<Route path="groups/:groupId/cycles/:cycleId/games" element={<GamesPage />} />
				<Route path="groups/:groupId/cycles/:cycleId/games/create" element={<CreateGame />} />
				<Route path="groups/:groupId/cycles/:cycleId/games/:gameId" element={<GamePage />} />
				<Route path="groups/:groupId/cycles" element={<CyclesPage />} />
			</Routes>
		</>
	);
}

export default App;

import { CreateEntity } from "view/CreateEntity/CreateEntity";
import { AppLayout, EntityLayout } from "layouts";
import { EntityListPage, EntityPage } from "pages";

import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useFirebaseApi } from "firebase-api";
import { useActions } from "store";
import {
	CreateGame,
	firestoreModel,
	GamePage,
	GamesPage,
	GroupPage,
	PlayerPage,
	PlayersPage,
} from "Entities";
import { CyclesPage } from "Entities/Cycle/CyclesPage";
import { CyclePage } from "Entities/Cycle/CyclePage";
import { CreateCyclePage } from "Entities/Cycle";

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
					<Route index element={"Select Entity"} />
					<Route path="players" element={<PlayersPage />} />
					<Route path="groups/:groupId/cycles/create" element={<CreateCyclePage />} />
					{/* {firestoreModel.getRoutes().map((route) => {
						return <Route key={route.name} path={route.path} element={route.ListPage} />;
					})} */}
				</Route>
				<Route path="groups/:groupId/cycles/:cycleId" element={<CyclePage />} />
				<Route path="groups/:groupId/cycles/:cycleId/games" element={<GamesPage />} />
				<Route path="groups/:groupId/cycles/:cycleId/games/create" element={<CreateGame />} />
				<Route path="groups/:groupId/cycles/:cycleId/games/:gameId" element={<GamePage />} />
				<Route path="/:entity/:id" element={<EntityPage />} />
				<Route path="groups/:groupId/cycles" element={<CyclesPage />} />

				<Route path=":entity" element={<AppLayout />}>
					<Route index element={<EntityListPage />} />
					<Route path="create" element={<CreateEntity />} />
				</Route>
				<Route element={<EntityLayout />}>
					<Route path="/:entity/:id/:subEntity/:subId" element={<EntityPage />} />
					<Route
						path="/:entity/:id/:subEntity/:subId/:subEntity2/:subEntity2Id"
						element={<EntityPage />}
					/>
				</Route>
				<Route path="groups/:groupId/cycles" />
				<Route element={<AppLayout />}>
					<Route path="/groups/:id/cycles" element={<EntityListPage />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;

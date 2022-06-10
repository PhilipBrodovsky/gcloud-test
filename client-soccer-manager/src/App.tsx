import { CreateEntity } from "view/CreateEntity/CreateEntity";
import { AppLayout, EntityLayout } from "layouts";
import { EntityListPage, EntityPage } from "pages";

import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useFirebaseApi } from "firebase-api";
import { useActions } from "store";

/**
 *   group
 *      cycles
 *          games
 *          teams
 *
 *      players
 *
 */

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
					<Route index element={"hem"} />
				</Route>
				<Route path=":entity" element={<AppLayout />}>
					<Route index element={<EntityListPage />} />
					<Route path="create" element={<CreateEntity />} />
				</Route>
				<Route element={<EntityLayout />}>
					<Route path="/:entity/:id" element={<EntityPage />} />
				</Route>
				<Route element={<AppLayout />}>
					<Route path="/groups/:id/cycles" element={<EntityListPage />} />
				</Route>
			</Routes>
		</>
	);
}

export default App;

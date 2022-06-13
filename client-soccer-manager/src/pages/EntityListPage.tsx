import { EntityList } from "view/EntityList/EntityList";
import { useFirebaseApi } from "firebase-api";
import { entityName, getEntityData } from "utils/entity";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Fab, Stack } from "@mui/material";

export function EntityListPage() {
	const { entity } = useParams<{ entity: entityName }>();

	const [entities, setEntities] = useState([]);
	const navigate = useNavigate();
	const firebaseApi = useFirebaseApi();
	const entityData = getEntityData(entity!);

	useEffect(() => {
		const unsub = firebaseApi.firesotre.subscribeCollection({
			collectionName: entityData.collection,
			callback: (res) => {
				setEntities(res.items);
			},
		});
		return () => unsub();
	}, [entity]);

	return (
		<Stack id="EntityListPage" width="100%">
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

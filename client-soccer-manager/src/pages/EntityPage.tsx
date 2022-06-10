import { useFirebaseApi } from "firebase-api";
import { entityName, getEntityData } from "utils/entity";
import { useEffect, useState } from "react";
import { Button, Stack, TextField } from "@mui/material";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GroupPage, PlayerPage } from "Entities";

export function EntityPage() {
	const params = useParams<{ entity: entityName; id: string }>();
	const entityData = getEntityData(params.entity!);
	const navigate = useNavigate();
	const location = useLocation();
	const firebaseApi = useFirebaseApi();
	console.log(location);

	const [item, setItem] = useState(null);

	useEffect(() => {
		const unsub = firebaseApi.firesotre.subscribeDoc({
			collectionName: entityData.collection,
			docId: params.id!,
			callback: (res) => {
				setItem(res.item);
			},
		});
		return () => unsub();
	}, [params.entity]);

	const addCycle = async () => {
		const res = await firebaseApi.firesotre.createDoc({
			collectionName: `${entityData.collection}/${params.id}/cycles`,
			data: { test: 1 },
		});
	};

	if (!item) return null;

	console.log("item", item);

	if (params.entity === "groups") {
		return <GroupPage group={item} />;
	}

	if (params.entity === "players") {
		return <PlayerPage player={item} />;
	}

	return (
		<Stack>
			<TextField label="cycle name" />
			<TextField label="players" />
			<TextField label="teams" />
			<TextField label="choose teams" />
			<Button onClick={addCycle}>{item.name}</Button>
		</Stack>
	);
}

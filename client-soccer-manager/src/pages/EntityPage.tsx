import { useFirebaseApi } from "firebase-api";
import { entityName, getEntityData } from "utils/entity";
import { useEffect, useState } from "react";
import { Button, Stack, TextField } from "@mui/material";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CyclePage, GamePage, GroupPage, PlayerPage } from "Entities";

export function EntityPage() {
	const params = useParams<{
		entity: entityName;
		id: string;
		subEntity: string;
		subId: string;
		subEntity2: string;
		subId2: string;
	}>();


	const itemId = params.subEntity2Id || params.subId || params.id;

	const entityData = getEntityData(params.entity!);
	const navigate = useNavigate();
	const location = useLocation();
	const firebaseApi = useFirebaseApi();

	const [item, setItem] = useState(null);

	useEffect(() => {
		const unsub = firebaseApi.firesotre.subscribeDoc({
			collectionName: location.pathname.split("/").slice(0, -1).join("/"),
			docId: itemId!,
			callback: (res) => {
				setItem(res.item);
			},
		});
		return () => unsub();
	}, [itemId]);

	if (!item) return null;

	if (params.subEntity2 === "games") {
		return <GamePage game={item} />;
	}

	if (params.subEntity === "cycles") {
		return <CyclePage cycle={item} />;
	}

	if (params.entity === "groups") {
		return <GroupPage group={item} />;
	}

	if (params.entity === "players") {
		return <PlayerPage player={item} />;
	}
}

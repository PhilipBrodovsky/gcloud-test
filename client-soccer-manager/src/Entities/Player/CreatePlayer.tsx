import { Button, Card, CardActions, CardMedia, MenuItem, Stack, TextField } from "@mui/material";
import { AppBarWithDrawer } from "components";
import { Field } from "components/Field/Field";
import { Player, useGroupForm, usePlayerForm } from "Entities";
import { useFirebaseApi } from "firebase-api";
import { addDoc, doc } from "firebase/firestore";
import { FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "store";
import { UrlUtils } from "utils";
import { entityName } from "utils/entity";

export const CreatePlayer = () => {
	const playerForm = usePlayerForm();

	const firebaseApi = useFirebaseApi();

	const navigate = useNavigate();

	const [form, setForm] = useState<{ [key: string]: any }>({});

	const onChange = (name: string, value: any) => {
		setForm({ ...form, [name]: value });
	};

	const createPlayer = async () => {
		const { image, ...rest } = form;
		const docRef = firebaseApi.firesotre.getDocRef({ collectionName: "players" })!;

		const file = image && (await firebaseApi.storage.uploadFile(image, `players/${docRef.id}`));
		const res = await firebaseApi.firesotre.createDoc({
			ref: docRef,
			data: { ...rest, image: file?.data || null },
		});

		setForm({});
		navigate("/players");
	};

	return (
		<AppBarWithDrawer
			title="Add Player"
			onBack={() => navigate(UrlUtils.removeLastPath(location.pathname))}
		>
			<Stack
				data-testid="CreateEntity"
				component={Card}
				p={2}
				gap={2}
				maxWidth={550}
				width="100%"
			>
				{playerForm.fields.map((field, index) => {
					return (
						<Field
							value={form[field.name || ""]}
							onChange={onChange}
							field={field}
							key={index}
						/>
					);
				})}
				<Button onClick={createPlayer} fullWidth variant="contained" size="large">
					Create
				</Button>
			</Stack>
		</AppBarWithDrawer>
	);
};

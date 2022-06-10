import { Button, Card, CardActions, CardMedia, MenuItem, Stack, TextField } from "@mui/material";
import { Player, useGroupForm, usePlayerForm } from "Entities";
import { useFirebaseApi } from "firebase-api";
import { addDoc, doc } from "firebase/firestore";
import { FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "store";
import { entityName } from "utils/entity";

interface FieldProps {
	field: any;
	value?: any;
	fullWidth?: boolean;
	onChange?: (name: string, value: any) => void;
}

interface Field {
	name: string;
	type: string;
}

export function Field(props: FieldProps) {
	const { field, value, onChange, fullWidth = false } = props;

	const hanldeChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value: newValue, files } = event.target as HTMLInputElement;
		onChange?.(name, files?.[0] || newValue);
	};

	if (field.type === "file") {
		const imageSrc = value ? URL.createObjectURL(value) : "";
		return (
			<label htmlFor={`file-upload-${field.name}`}>
				<Stack direction="row" gap={2}>
					<TextField
						label={field.label}
						value={value?.name || ""}
						sx={{ flexGrow: 1 }}
						disabled
					/>
					<input
						onChange={hanldeChange}
						hidden
						accept="image/*"
						id={`file-upload-${field.name}`}
						type="file"
						name={field.name}
					/>
					<Button variant="contained" component="span">
						Upload
					</Button>
				</Stack>
				{imageSrc && (
					<CardMedia
						sx={{
							my: 1,
							height: "200px",
							objectFit: "contain",
							objectPosition: "center",
							border: 1,
						}}
						component={"img"}
						src={imageSrc}
						alt=""
					/>
				)}
			</label>
		);
	}

	return (
		<TextField
			autoComplete="off"
			fullWidth={fullWidth}
			onChange={hanldeChange}
			value={value || field.emptyValue}
			name={field.name}
			label={field.label}
			select={field.type === "select"}
			SelectProps={field.selectProps}
			inputProps={{ hidden: true }}
			children={
				field.type === "select" &&
				field.list.map((option: { value: any; label: string }) => (
					<MenuItem key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				))
			}
		/>
	);
}

const getEntityData = (entity: string) => {
	const colName = entity;
	return {
		collection: colName,
		path: "/" + colName,
	};
};

interface CreateEntityProps {}

export const CreateEntity = (props: CreateEntityProps) => {
	const { entity } = useParams<{ entity: entityName }>();

	const players = useAppSelector((state) => state.players.list);

	const groupForm = useGroupForm();
	const playerForm = usePlayerForm();

	const firebaseApi = useFirebaseApi();

	const entityData = getEntityData(entity!);

	const navigate = useNavigate();

	const [form, setForm] = useState<{ [key: string]: any }>({});
	console.log("form", form);

	const onChange = (name: string, value: any) => {
		setForm({ ...form, [name]: value });
	};

	console.log("====================================");
	console.log("entityData", entityData);
	console.log("====================================");

	let formFields = null;

	const createGroup = async () => {
		const { image, ...rest } = form;
		const docRef = firebaseApi.firesotre.getDocRef({ collectionName: "groups" })!;
		console.log("docRef,", docRef);

		const file = await firebaseApi.storage.uploadFile(image, `groups/${docRef.id}`);
		const res = await firebaseApi.firesotre.createDoc({
			ref: docRef,
			data: { ...rest, image: file.data },
		});
		console.log("res", res);

		setForm({});
		navigate(entityData.path);
	};

	const createPlayer = async () => {
		const { image, ...rest } = form;
		const docRef = firebaseApi.firesotre.getDocRef({ collectionName: "players" })!;

		const file = await firebaseApi.storage.uploadFile(image, `players/${docRef.id}`);
		const res = await firebaseApi.firesotre.createDoc({
			ref: docRef,
			data: { ...rest, image: file.data },
		});
		console.log("res", res);

		setForm({});
		navigate(entityData.path);
	};
	const createEntity = () => {
		if (entity === "groups") return createGroup();
		if (entity === "players") return createPlayer();
	};

	if (entity === "groups") {
		formFields = groupForm.fields.map((field, index) => {
			return <Field value={form[field.name]} onChange={onChange} field={field} key={index} />;
		});
	}
	if (entity === "players") {
		formFields = playerForm.fields.map((field, index) => {
			return <Field value={form[field.name]} onChange={onChange} field={field} key={index} />;
		});
	}

	return (
		<Stack data-testid="CreateEntity" component={Card} p={2} gap={2} maxWidth={550} width="100%">
			{formFields}
			<Button onClick={createEntity} fullWidth variant="contained" size="large">
				Create
			</Button>
		</Stack>
	);
};

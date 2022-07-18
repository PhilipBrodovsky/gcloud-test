import { Button, Card, CardActions, CardMedia, MenuItem, Stack, TextField } from "@mui/material";
import { AppBarWithDrawer } from "components";
import { Player, useGroupForm, usePlayerForm } from "Entities";
import { useFirebaseApi } from "firebase-api";
import { addDoc, doc } from "firebase/firestore";
import { FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "store";
import { UrlUtils } from "utils";
import { entityName } from "utils/entity";

interface FieldProps {
	field: Field;
	value?: any;
	fullWidth?: boolean;
	onChange?: (name: string, value: any) => void;
}

interface Field {
	name?: string;
	type?: string;
	label?: string;
	defaultValue?: any;
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
			type={field.type}
			fullWidth={fullWidth}
			onChange={hanldeChange}
			value={value || field.defaultValue}
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

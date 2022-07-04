import { Button, CardMedia, MenuItem, SelectProps, Stack, TextField } from "@mui/material";
import { FormEvent } from "react";

interface FieldProps {
	field: Field;
	value?: any;
	fullWidth?: boolean;
	onChange?: (name: string, value: any) => void;
}

export interface Field {
	selectProps?: Partial<SelectProps<unknown>>;
	list?: any;
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

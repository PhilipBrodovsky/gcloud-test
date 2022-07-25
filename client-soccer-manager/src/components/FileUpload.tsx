import { Box, Button, Stack, SxProps, TextField } from "@mui/material";
import { FormEvent } from "react";

export const FileUpload = (props: { sx?: SxProps }) => {
	const { name, onChange, children, sx } = props;

	const hanldeChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, files } = event.target as HTMLInputElement;
		onChange?.(name, files?.[0]);
	};
	return (
		<Box sx={sx} component={"label"} htmlFor={`file-upload-${name}`}>
			<Stack direction="row" gap={2}>
				<input
					onChange={hanldeChange}
					hidden
					accept="image/*"
					id={`file-upload-${name}`}
					type="file"
					name={name}
				/>
				<Button variant="contained" component="span">
					{children}
				</Button>
			</Stack>
		</Box>
	);
};

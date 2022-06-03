import { useState } from "react";
import Button from "@mui/material/Button";
import MuiDialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Stack, TextField, MenuItem } from "@mui/material";

const fields = [
	{ name: "name", label: "Name", defaultValue: "" },

	{
		name: "players",
		label: "Players",
		type: "select",
		list: [
			{ label: "itay", value: 1 },
			{ label: "gal", value: 2 },
		],
		defaultValue: [],
		selectProps: { multiple: true },
	},
];

export function Dialog(props: any) {
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

	const [form, setForm] = useState({});

	console.log("form", form);

	const hanldeChange = (event) => {
		console.log(event.target.value);
		setForm({ ...form, [event.target.name]: event.target.value });
	};

	return (
		<MuiDialog
			fullScreen={fullScreen}
			open={props.open}
			onClose={props.handleClose}
			aria-labelledby="responsive-dialog-title"
		>
			<DialogTitle id="responsive-dialog-title">Create New Cycle</DialogTitle>
			<DialogContent>
				<Stack my={2} gap={2}>
					{fields.map((field) => {
						return (
							<TextField
								onChange={hanldeChange}
								value={form[field.name] || field.defaultValue}
								name={field.name}
								label={field.label}
								select={field.type === "select"}
								SelectProps={field.selectProps}
								children={
									field.type === "select" &&
									field.list.map((option) => (
										<MenuItem key={option.value} value={option.value}>
											{option.label}
										</MenuItem>
									))
								}
							/>
						);
					})}
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={props.handleClose}>
					Cancel
				</Button>
				<Button onClick={props.handleClose} autoFocus>
					Create
				</Button>
			</DialogActions>
		</MuiDialog>
	);
}

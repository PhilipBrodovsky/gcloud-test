import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Button, Card, IconButton, Stack, TextField } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

const fields = [
    {
        name: "name",
    },
    {
        name: "description",
    },
    {
        name: "category",
    },
    {
        name: "hasEndDate",
    },
    {
        name: "endDate",
    },
    {
        name: "endDateNotification",
    },
    {
        name: "hasStartDate",
    },
    {
        name: "startDate",
    },
    {
        name: "startDateNotification",
    },
];

function App() {
    const [count, setCount] = useState(0);

    return (
        <div className="App">
            <Card sx={{ padding: 2 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    gap={1}
                >
                    <Button color="primary" variant="contained">
                        <AddIcon />
                    </Button>
                </Stack>
            </Card>
            <Stack margin={2} gap={4}>
                {fields.map((field) => (
                    <TextField variant="outlined" label={field.name} />
                ))}
            </Stack>
        </div>
    );
}

export default App;

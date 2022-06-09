import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { AppBar, Toolbar, useTheme } from "@mui/material";
import { AppLayout } from "./AppLayout";

function App() {
    const [count, setCount] = useState(0);

    const t = useTheme();
    console.log("t", t);

    return (
        <div className="App">
            <AppLayout />
        </div>
    );
}

export default App;

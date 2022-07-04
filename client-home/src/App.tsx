import { useContext, useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { AppBar, Toolbar, useTheme } from "@mui/material";
import { AppLayout } from "./AppLayout";
import { useFirebaseApi } from "./firebase-api";
import { StoreContext } from "./main";

function App() {
	const [count, setCount] = useState(0);

	const t = useTheme();
	console.log("t", t);

	const firebaseApi = useFirebaseApi();

	const context = useContext(StoreContext);

	useEffect(() => {
		firebaseApi.auth.subscribe((user) => {
			context.setUser(user);
		});
	});

	return (
		<div className="App">
			<AppLayout />
		</div>
	);
}

export default App;

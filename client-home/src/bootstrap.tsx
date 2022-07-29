import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { createContext, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";


const theme = createTheme({
	palette: {
		primary: {
			main: "rgb(0, 30, 60)",
		},
	},
});

interface StoreContext {
	user: any;
	setUser: any;
}

export const StoreContext = createContext<StoreContext>({ user: null });

function StoreProvider({ children }: any) {
	const [user, setUser] = useState(null);
	const value = useMemo(() => {
		return { user, setUser };
	}, [user]);

	console.log("====================================");
	console.log('USER",', user);
	console.log("====================================");
	return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
	// <React.StrictMode>
	<StoreProvider>
		<ThemeProvider theme={theme}>
			<App />
		</ThemeProvider>
	</StoreProvider>
	// </React.StrictMode>
);

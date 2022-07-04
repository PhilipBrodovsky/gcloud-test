import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import { getAuth, signInWithPopup, GoogleAuthProvider, getRedirectResult } from "firebase/auth";

import { Button } from "@mui/material";

import { app } from "./firebase-api";

const provider = new GoogleAuthProvider();
provider.addScope('photos.readonly')

const auth = getAuth(app);

function App() {
	const [count, setCount] = useState(0);

	useEffect(() => {
		getRedirectResult(auth)
			.then((result) => {
				// This gives you a Google Access Token. You can use it to access Google APIs.
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;

				// The signed-in user info.
				const user = result.user;
			})
			.catch((error) => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.customData.email;
				// The AuthCredential type that was used.
				const credential = GoogleAuthProvider.credentialFromError(error);
				// ...
			});
	}, []);

	function googleLogin() {
		signInWithPopup(auth, provider)
			.then((result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				// The signed-in user info.
				const user = result.user;
				// ...
			})
			.catch((error) => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.customData.email;
				// The AuthCredential type that was used.
				const credential = GoogleAuthProvider.credentialFromError(error);
				// ...
			});
	}

	return (
		<div className="App">
			<Button variant="contained" onClick={googleLogin}>
				Login
			</Button>
		</div>
	);
}

export default App;

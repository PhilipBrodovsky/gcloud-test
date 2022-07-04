import { FirebaseApp } from "firebase/app";
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	onAuthStateChanged,
	User,
	signOut,
} from "firebase/auth";
import { app } from ".";

const provider = new GoogleAuthProvider();

export function getAuthApi(app: FirebaseApp) {
	const auth = getAuth(app);

	function subscribe(callback: (user: User) => void) {
		onAuthStateChanged(auth, callback);
	}

	function logout() {
		return signOut(auth);
	}

	function googleLogin() {
		return signInWithPopup(auth, provider)
			.then((result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential?.accessToken;
				// The signed-in user info.
				const user = result.user;
				console.log(user.accessToken);
				console.log(token);

				return user;

				// ...
			})
			.catch((error) => {
				console.log(error);

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

	return {
		googleLogin,
		subscribe,
		logout,
	};
}

import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getDocs, getFirestore, onSnapshot } from "firebase/firestore";

const app = initializeApp({
	apiKey: "AIzaSyClGm6kruNdLaUPqBnBqa-IZFbnpxsgIow",
	authDomain: "easylife-55a85.firebaseapp.com",
	projectId: "easylife-55a85",
	storageBucket: "easylife-55a85.appspot.com",
	messagingSenderId: "1594199736",
	appId: "1:1594199736:web:82b1ed2303cabc5c736e4d",
	measurementId: "G-SDC1X4CNY1",
});

const firestoreDB = getFirestore(app);

interface createDocProps {
	collectionName: string;
	data: any;
}
export const useFirebaseApi = () => {
	const createDoc = async ({ collectionName, data }: createDocProps) => {
		try {
			const collRef = collection(firestoreDB, collectionName);
			const docRef = await addDoc(collRef, data);
			console.log("docRef", docRef.id);
			return;
		} catch (error) {}
	};

	const subscribeCollection = ({
		collectionName,
		callback,
	}: {
		collectionName: string;
		callback: (result: { items: [] }) => void;
	}) => {
		const collRef = collection(firestoreDB, collectionName);
		const unsubscribe = onSnapshot(collRef, (snapshot) => {
			let result: any[] = [];
			snapshot.forEach((doc) => {
				result.push({
					id: doc.id,
					...doc.data(),
				});
			});
			callback({ items: result });
		});
		return unsubscribe;
	};

	return {
		firesotre: {
			createDoc,
			subscribeCollection,
		},
	};
};
export { app };

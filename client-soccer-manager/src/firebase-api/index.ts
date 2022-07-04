import { initializeApp } from "firebase/app";
import {
	addDoc,
	collection,
	CollectionReference,
	deleteDoc,
	doc,
	DocumentData,
	DocumentReference,
	getDocs,
	getFirestore,
	onSnapshot,
	setDoc,
	updateDoc,
	increment,
} from "firebase/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

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
const storage = getStorage(app);

interface createDocProps {
	data: any;
	collectionName?: string;
	ref?: DocumentReference<DocumentData>;
}
export const useFirebaseApi = () => {
	const createDoc = async ({ collectionName = "", ref, data }: createDocProps) => {
		try {
			const collRef = ref ? ref : doc(collection(firestoreDB, collectionName));
			await setDoc(collRef, data);
			return { success: true };
		} catch (error) {
			console.log(error);
		}
	};

	const updateDocument = async ({
		collectionName = "",
		id,
		data,
	}: {
		collectionName: string;
		id: string;
		data: any;
	}) => {
		try {
			const docRef = doc(collection(firestoreDB, collectionName), id);
			await updateDoc(docRef, data, data);
			return { success: true };
		} catch (error) {
			console.log(error);
		}
	};

	const getDocRef = ({ collectionName }: { collectionName: string }) => {
		try {
			const collRef = doc(collection(firestoreDB, collectionName));
			return collRef;
		} catch (error) {
			console.log(error);
		}
	};

	const deleteDocument = async ({
		collectionName,
		id,
	}: {
		collectionName: string;
		id: string;
	}) => {
		try {
			const ref = doc(firestoreDB, collectionName, id);
			await deleteDoc(ref);
			console.log(`success delete document ${id} from ${collectionName}`);
			return { success: true };
		} catch (error: any) {
			console.log(`fail delete document ${id} from ${collectionName}`, error.message);
			return { success: false };
		}
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

	const subscribeDoc = ({
		collectionName,
		docId,
		callback,
	}: {
		collectionName: string;
		docId: string;
		callback: (result: { item: any }) => void;
	}) => {
		const docRef = doc(firestoreDB, collectionName, docId);
		const unsubscribe = onSnapshot(docRef, (doc) => {
			if (!doc.exists()) return null;

			const item = {
				id: doc.id,
				...doc.data(),
			};

			callback({ item });
		});
		return unsubscribe;
	};

	//  storage

	const createRef = (path: string) => {
		return ref(storage, path);
	};

	const deleteFile = async (path: string) => {
		const fileRef = createRef(path);
		await deleteObject(fileRef);
	};

	const uploadFile = async (file: File, path: string = "") => {
		const fileRef = createRef(path);

		await uploadBytes(fileRef, file);
		const url = await getDownloadURL(fileRef);
		return {
			success: true,
			data: {
				url,
				bucket: fileRef.bucket,
				fullPath: fileRef.fullPath,
				name: fileRef.name,
			},
		};
	};

	return {
		storage: { createRef, uploadFile, deleteFile },
		firesotre: {
			getDocRef,
			createDoc,
			deleteDocument,
			subscribeDoc,
			subscribeCollection,
			updateDocument,
			increment,
		},
	};
};
export { app };

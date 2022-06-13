// firestore image
export interface Img {
	bucket: string;
	fullPath: string;
	name: string;
	url: string;
}

export interface Field {
	name?: string;
	label?: string;
	defaultValue?: any;
	type?: "text" | "number" | "file" | "select" | "select-multi";
}

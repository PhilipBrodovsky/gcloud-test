import { Field } from "types";
import { Player } from "./Player";

export * from "./Player";
export * from "./PlayerPage";
export * from "./PlayersPage";

export type NewPlayer = Omit<Player, "id">;

export const usePlayerForm = () => {
	const fields: Field[] = [
		{ name: "name", label: "Name", defaultValue: "" },
		{ name: "image", label: "Image", defaultValue: "", type: "file" },
	];
	return { fields };
};

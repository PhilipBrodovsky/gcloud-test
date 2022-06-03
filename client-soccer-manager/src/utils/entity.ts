export type entityName = "group" | "player";

export const getEntityData = (entity: entityName) => {
	const colName = entity + "s";
	return {
		collection: colName,
		path: "/" + colName,
	};
};

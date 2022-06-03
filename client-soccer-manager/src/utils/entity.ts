export type entityName = "groups" | "players";

export const getEntityData = (entity: entityName) => {
    const colName = entity?.toLowerCase();
    return {
        collection: colName,
        path: "/" + colName,
    };
};

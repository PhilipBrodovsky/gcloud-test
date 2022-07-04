export * from "./Player";
export * from "./Group";
export * from "./Cycle/Cycle";
export * from "./Game";

interface Model {
	entityName: string;
	children?: Model[];
	ListPage: React.ReactNode;
}

interface FirestoreEntity {
	name: string;
	parentName: string;
	path: string;
	ListPage: React.ReactNode;
}
class FirestoreModel {
	entities: { [key: string]: FirestoreEntity };
	constructor(model: Model) {
		this.entities = {};
		loopOnObject(model, null, (entity: Model, parent: Model) => {
			if (!entity.entityName) return;

			const parentEntity = parent && this.entities[parent.entityName];
			const parentEntiyId = parentEntity && parentEntity.name.slice(0, -1) + "Id";

			this.entities[entity.entityName] = {
				name: entity.entityName,
				ListPage: entity.ListPage,
				parentName: parent ? parent.entityName : "",
				path: `${
					parentEntity
						? parentEntity.path + `/:${parentEntiyId}/${entity.entityName}`
						: `/${entity.entityName}`
				}`,
			};
		});
	}

	getEntiy(name: string) {
		return this.entities[name];
	}

	getRoutes() {
		return Object.values(this.entities);
	}
}

function loopOnObject(object: Model, parent: Model | null, callback: any) {
	callback(object, parent);
	if (object.children)
		object.children.forEach((child) => {
			loopOnObject(child, object, callback);
		});
}

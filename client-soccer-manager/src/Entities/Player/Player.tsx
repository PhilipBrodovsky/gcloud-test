import { useState } from "react";
import { Img } from "types";

export class Player {
	id: string;
	name: string;
	image?: Img;

	constructor(player: Player) {
		this.id = player.id;
		this.name = player.name;
		this.image = player.image;
	}
}

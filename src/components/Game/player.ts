export class Player {
	id: string;
	position: { x: number; y: number };
	width: number;
	height: number;
	websocket: WebSocket | undefined;

	constructor(websocket?: WebSocket) {
		this.id = "";
		this.position = { x: 0, y: 0 };
		this.width = 0;
		this.height = 0;

		this.websocket = websocket;
	}

	init_vars(
		id: string,
		position: { x: number; y: number },
		width: number,
		height: number
	) {
		this.id = id;
		this.position = position;
		this.width = width;
		this.height = height;
	}

	handle_movement(direction: string) {
		if (this.websocket) {
			this.websocket.send(JSON.stringify({ type: "movement", direction }));
		}
	}
}
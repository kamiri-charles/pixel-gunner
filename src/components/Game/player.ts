export class Player {
    id: string;
    position: { x: number; y: number; };
    width: number;
    height: number;

    constructor() {
        this.id = "";
        this.position = {x: 0, y: 0};
        this.width = 0;
        this.height = 0;
    }

    init_vars(id: string, position: {x: number, y: number}, width: number, height: number) {
        this.id = id;
        this.position = position;
        this.width = width;
        this.height = height;
    }

    update(position: {x: number, y: number}) {
        this.position = position;
    }

    render(context: CanvasRenderingContext2D) {
        context.fillStyle = 'red';
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}
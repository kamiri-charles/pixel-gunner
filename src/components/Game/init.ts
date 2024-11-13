export const canvas_init = (canvas: HTMLCanvasElement, data: any) => {
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    if (ctx) {
        ctx.fillStyle = "grey";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (data) {
            console.log(data);
            data.forEach((entity: any) => {
                ctx.beginPath();
                ctx.fillStyle = 'red';
                ctx.fillRect(entity.position[0], entity.position[1], entity.width, entity.height);
            })
        }
    }
}


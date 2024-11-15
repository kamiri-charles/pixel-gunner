export const handle_rendering = (context: CanvasRenderingContext2D, data: any) => {
    // Clear canvas
    context.fillStyle = "white";
    context.fillRect(0, 0, 800, 600);
    
    data.forEach((entity: any) => {
        context.beginPath();
        context.fillStyle = "red";
        context.fillRect(entity.position[0], entity.position[1], entity.width, entity.height);
    })
}


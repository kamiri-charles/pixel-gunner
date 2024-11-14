import { useEffect, useRef, useState } from "react";
import { handle_rendering } from "./init";
import { Player } from "./player";
import "./styles.css";

interface GameProps {
	data: any;
}

const Game: React.FC<GameProps> = ({ data }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [renderingContext, setRenderringContext] = useState<CanvasRenderingContext2D>();
	const player = new Player();

	useEffect(() => {
		if (data) {
			if (data.initial != undefined || data.initial) {
				player.init_vars(data.id, {x: data.pos_x, y: data.pos_y}, data.width, data.height);

				// Initialize canvas
				if (canvasRef.current) {
					console.log("canvas init")
					canvasRef.current.width = 800;
					canvasRef.current.height = 600;
					const c = canvasRef.current.getContext("2d");
					if (c) setRenderringContext(c);
				}
				
			} else {
				if (renderingContext) {
					handle_rendering(renderingContext, data);
				}
			}
		}
	}, [data]);

	return <canvas ref={canvasRef}></canvas>;
};

export default Game;

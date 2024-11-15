import { useEffect, useRef, useState, useMemo } from "react";
import { handle_rendering } from "./utils";
import { Player } from "./player";
import "./styles.css";

interface GameProps {
	websocket: WebSocket | undefined;
	data: any;
}

const Game: React.FC<GameProps> = ({ websocket, data }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [renderingContext, setRenderingContext] =
		useState<CanvasRenderingContext2D | null>(null);

	// Memoized Player instance to prevent recreation
	const player = useMemo(() => new Player(websocket), [websocket]);

	// Initialize canvas
	const initializeCanvas = () => {
		if (canvasRef.current) {
			canvasRef.current.width = 800;
			canvasRef.current.height = 600;
			const context = canvasRef.current.getContext("2d");
			if (context) {
				setRenderingContext(context);
			} else {
				console.error("Failed to get 2D rendering context");
			}
		}
	};

	// Handle data updates
	useEffect(() => {
		if (!data) return;

		if (data.initial) {
			player.init_vars(
				data.id,
				{ x: data.pos_x, y: data.pos_y },
				data.width,
				data.height
			);
			initializeCanvas();
		} else if (renderingContext) {
			handle_rendering(renderingContext, data);
		}
	}, [data, renderingContext, player]);

	// Handle key events
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!websocket) return;
			switch (e.key) {
				case "ArrowUp":
				case "w":
					player.handle_movement("jump");
					break;
				case "ArrowDown":
				case "s":
					player.handle_movement("down");
					break;
				case "ArrowLeft":
				case "a":
					player.handle_movement("left");
					break;
				case "ArrowRight":
				case "d":
					player.handle_movement("right");
					break;
				default:
					return;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [websocket, player]);

	return <canvas ref={canvasRef} />;
};

export default Game;

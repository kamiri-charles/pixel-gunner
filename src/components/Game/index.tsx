import { useEffect, useRef } from "react";
import { canvas_init } from "./init";
import "./styles.css";

interface GameProps {
	data: any;
}

const Game: React.FC<GameProps> = ({ data }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (canvasRef.current) {
			canvas_init(canvasRef.current, data);
		}
	}, [data]);

	return <canvas ref={canvasRef}></canvas>;
};

export default Game;

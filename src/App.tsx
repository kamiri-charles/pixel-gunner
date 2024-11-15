import { useEffect, useState } from "react";
import Game from "./components/Game";
import "./App.css";

function App() {
	const [gameData, setGameData] = useState<any>();
	const [ws, setWs] = useState<WebSocket | undefined>();

	useEffect(() => {
		const new_ws = new WebSocket("ws://localhost:8765");
		setWs(new_ws);

		// When the connection is established
		new_ws.onopen = () => {
			console.log("Connected to the WebSocket server");
		};

		new_ws.onmessage = (message) => {
			setGameData(JSON.parse(message.data));
		};


		// Clean up the WebSocket connection on component unmount
		return () => {
			new_ws.close();
		};
	}, []);

	return (
		<>
			{gameData ? (
				<Game websocket={ws} data={gameData} />
			) : (
				<div>Loading game...</div>
			)}
		</>
	);
}

export default App;

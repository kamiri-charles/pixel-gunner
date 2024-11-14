import { useEffect, useState } from "react";
import Game from "./components/Game";
import "./App.css";

function App() {
	const [gameData, setGameData] = useState<any>();

	useEffect(() => {
		const ws = new WebSocket("ws://localhost:8765");

		// When the connection is established
		ws.onopen = () => {
			console.log("Connected to the WebSocket server");
		};

		ws.onmessage = (message) => {
			setGameData(JSON.parse(message.data));
		};

		// Clean up the WebSocket connection on component unmount
		return () => {
			ws.close();
		};
	}, []);

	return (
		<>
			<Game data={gameData} />
		</>
	);
}

export default App;

"use client";

import { useEffect, useState } from "react";

const Game = () => {
    const [players, setPlayers] = useState<string[]>([]);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const playersParam = searchParams.get("players");
        if (playersParam) {
            setPlayers(JSON.parse(playersParam));
        }
    }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Game Page</h1>
      <ul className="list-disc list-inside">
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
    </div>
  )
}

export default Game
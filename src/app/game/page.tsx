"use client";

import GameCard from "@/components/GameCard";
import GameHeader from "@/components/GameHeader";
import { ArrowRightLeftIcon, Check, X } from "lucide-react";
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
    <div className="min-h-screen w-full flex flex-col items-center">
      <GameHeader/>
      <p className="mt-6 text-6xl tracking-widest text-red">10</p>
      <div className="flex-1 flex flex-col items-center justify-center ">
        <GameCard content="Wie viele Elemente gibt es im Periodensystem?"/>
        <div className="w-[70px] h-[70px] flex items-center justify-center shadow bg-blue mt-12 cursor-pointer rounded-full">
          <ArrowRightLeftIcon className="text-white w-8"/>
        </div>
        <div className="mt-12 p-2 w-md flex flex-row items-center justify-center gap-8">
          <div className="flex w-[120px] items-center justify-around p-2 bg-green text-white rounded-lg cursor-pointer shadow-xl hover:scale-105 transition-all">
            <Check/>
            <p className="text-xl tracking-wider">Richtig</p>
          </div>
          <div className="flex w-[120px] items-center justify-around p-2 bg-red text-white rounded-lg cursor-pointer shadow-xl hover:scale-105 transition-all">
            <X/>
            <p className="text-xl tracking-wider">Falsch</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Game
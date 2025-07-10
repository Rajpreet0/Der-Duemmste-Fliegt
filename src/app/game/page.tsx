"use client";

import GameCard from "@/components/GameCard";
import GameHeader from "@/components/GameHeader";
import { ArrowRightLeftIcon, Check, X } from "lucide-react";
import { useEffect, useState } from "react";

const Game = () => {

    const [players, setPlayers] = useState<string[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [playerLives, setPlayerLives] = useState<number[]>([]);

    const [secondsLeft, setSecondsLeft] = useState(10);
    const [showAnswer, setShowAnswer] = useState(false);

    // Get Players Name from URI
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const playersParam = searchParams.get("players");
        if (playersParam) {
            const parsedPlayers = JSON.parse(playersParam);
            setPlayers(parsedPlayers);
            setPlayerLives(new Array(parsedPlayers.length).fill(3));
        }
    }, []);

    // Timer
    useEffect(() => {
      if (secondsLeft === 0) {
        setShowAnswer(true);
      } 

      if (secondsLeft > 0) {
        const timer = setTimeout(() => {
          setSecondsLeft(secondsLeft - 1);
        }, 1000); 

        return () => clearTimeout(timer);
      }
    }, [secondsLeft]);


    // Navigation 
    const nextPlayer = () => {
      let nextIndex = currentPlayerIndex;
      for (let i = 0; i < players.length; i++) {
        nextIndex = (nextIndex + 1) % players.length;
        if (playerLives[nextIndex] > 0) {
          break;
        }
      }
      setCurrentPlayerIndex(nextIndex);
      setSecondsLeft(10);
      setShowAnswer(false);
    }

    const handleCorrect = () => {
      nextPlayer();
    }

    const handleWrong = () => {
      const updatedLives = [...playerLives];
      updatedLives[currentPlayerIndex] -= 1;
      setPlayerLives(updatedLives);
      nextPlayer();
    }

    const handleSkip = () => {
      setSecondsLeft(10);
      setShowAnswer(false);
    }

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <GameHeader 
        onSkip={handleSkip}
        currentPlayer={players[currentPlayerIndex]} 
        currentPlayerLives={playerLives[currentPlayerIndex]}/>
      <p className="mt-6 text-6xl tracking-widest text-red">{secondsLeft}</p>
      <div className="flex-1 flex flex-col items-center justify-center ">
        <GameCard content={showAnswer ? "Antwort: 118 Elemente" : "Wie viele Elemente gibt es im Periodensystem?"}/>
        <div 
          onClick={() => setShowAnswer(!showAnswer)}
          className="w-[70px] h-[70px] flex items-center justify-center shadow bg-blue mt-12 cursor-pointer rounded-full">
            <ArrowRightLeftIcon className="text-white w-8"/>
        </div>
        {showAnswer && (
          <div className="mt-12 p-2 w-md flex flex-row items-center justify-center gap-8">
            <div
              onClick={handleCorrect} 
              className="flex w-[120px] items-center justify-around p-2 bg-green text-white rounded-lg cursor-pointer shadow-xl hover:scale-105 transition-all">
              <Check/>
              <p className="text-xl tracking-wider">Richtig</p>
            </div>
            <div 
              onClick={handleWrong} 
              className="flex w-[120px] items-center justify-around p-2 bg-red text-white rounded-lg cursor-pointer shadow-xl hover:scale-105 transition-all">
              <X/>
              <p className="text-xl tracking-wider">Falsch</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Game
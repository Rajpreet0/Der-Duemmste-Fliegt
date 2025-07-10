"use client";

import GameCard from "@/components/GameCard";
import GameHeader from "@/components/GameHeader";
import { ArrowRightLeftIcon, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Game = () => {

    const [players, setPlayers] = useState<string[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [playerLives, setPlayerLives] = useState<number[]>([]);

    const [secondsLeft, setSecondsLeft] = useState(15);
    const [showAnswer, setShowAnswer] = useState(false);

    const [sessionQuestions, setSessionQuestions] = useState<{ question: string; answer: string }[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

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

    // Fetch Questions on Start
    useEffect(() => {
      const fetchQuestionsForSession = async () => {
        try {
          const res = await fetch('/api/v1/getQuestions', { method: 'POST' });
          if (!res.ok) throw new Error('Fehler beim Abrufen der Fragen');
          const data = await res.json();
          setSessionQuestions(data.questions);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
      };

      fetchQuestionsForSession();
    }, []);

    // Timer
    useEffect(() => {

      if (isLoading || sessionQuestions.length === 0) return;

      if (secondsLeft === 0) {
        setShowAnswer(true);
        return;
      }

      const timer = setTimeout(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }, [secondsLeft, isLoading, sessionQuestions]);


    const fetchNewQuestions = async () => {
      try {
          const res = await fetch('/api/v1/getQuestions', { method: 'POST' });
          if (!res.ok) throw new Error('Fehler beim Abrufen der Fragen');
          const data = await res.json();
          setSessionQuestions(data.questions);
          setCurrentQuestionIndex(0); 
          setSecondsLeft(10);
          setShowAnswer(false);
      } catch (error) {
        console.log(error);
      }
    }

    const getAlivePlayersCount = () => {
      return playerLives.filter(lives => lives > 0).length;
    };

    const getWinnerName = () => {
      const aliveIndex = playerLives.findIndex(lives => lives > 0);
      return players[aliveIndex];
    }

    // Navigation
    const nextPlayer = () => {

      if (getAlivePlayersCount() === 1) {
        const winner = getWinnerName()
        router.push(`/result?winner=${encodeURIComponent(winner)}`);
        return;
      }

      let nextIndex = currentPlayerIndex;
      for (let i = 0; i < players.length; i++) {
        nextIndex = (nextIndex + 1) % players.length;
        if (playerLives[nextIndex] > 0) {
          break;
        }
      }
      setCurrentPlayerIndex(nextIndex);
      nextQuestion();
    };

    const nextQuestion = async () => {
      const nextIndex = currentQuestionIndex + 1;

      if (nextIndex >= sessionQuestions.length) {
        if (getAlivePlayersCount() > 1) {
          alert("Alle Fragen verbraucht, lade neue Fragen...");
          await fetchNewQuestions();
        } else {
          console.log("Spielende: Nur noch ein Spieler lebt.");
        }
      } else {
        setCurrentQuestionIndex(nextIndex);
        setSecondsLeft(10);
        setShowAnswer(false);
      }
    };

    const handleCorrect = () => {
      nextPlayer();
    };

    const handleWrong = () => {
      const updatedLives = [...playerLives];
      updatedLives[currentPlayerIndex] -= 1;
      setPlayerLives(updatedLives);
      nextPlayer();
    };

    const handleSkip = () => {
      setSecondsLeft(10);
      setShowAnswer(false);
      nextQuestion(); // skip question, stay on same player
    };

    const currentQuestion = sessionQuestions[currentQuestionIndex];

      
    if (isLoading || sessionQuestions.length === 0) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center text-center">
          <p className="text-2xl text-blue">Fragen werden geladen... Bitte warten 🌀</p>
        </div>
      );
    }


  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      <GameHeader 
        onSkip={handleSkip}
        currentPlayer={players[currentPlayerIndex]} 
        currentPlayerLives={playerLives[currentPlayerIndex]}/>
      <p className="mt-6 text-6xl tracking-widest text-red">{secondsLeft}</p>
      <div className="flex-1 flex flex-col items-center justify-center ">
        {currentQuestion ? (
          <GameCard content={showAnswer ? `Antwort: ${currentQuestion.answer}` : currentQuestion.question} />
        ) : (
          <p className="text-xl">Fragen werden geladen...</p>
        )}
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
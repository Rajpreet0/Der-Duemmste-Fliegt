"use client";

import GameCard from "@/components/GameCard";
import GameHeader from "@/components/GameHeader";
import PowerUpComponent from "@/components/PowerUpComponent";
import { ArrowRightLeftIcon, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { useGame } from "@/features/game/useGame";
import { getQuestions } from "@/lib/api";
import { getAlivePlayersCount } from "@/features/game/gameLogic";
import { useRouter } from "next/navigation";

const GamePage = () => {
  const { state, markPowerUpAsUsed, handleCorrectAnswer, handleWrongAnswer, resetTimer, setState } = useGame();

  const [countdownPaused, setCountdownPaused] = useState(false);
  const router = useRouter();

  const currentQuestion = state.sessionQuestions[state.currentQuestionIndex];

  const fetchQuestions = async (category: string) => {
    try {
      const data = await getQuestions(category);
      setState(prev => ({
        ...prev,
        sessionQuestions: data.questions,
        currentQuestionIndex: 0,
        showAnswer: false,
        secondsLeft: prev.initialTimer
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const playersParam = searchParams.get("players");
    const timerParam = searchParams.get("timer");
    const livesParam = searchParams.get("lives");
    const powerUpsParam = searchParams.get("powerUps");
    const categoryParam = searchParams.get("category") ?? "Allgemeinwissen";

    const parsedTimer = timerParam ? parseInt(timerParam) : 15;
    const parsedLives = livesParam ? parseInt(livesParam) : 3;

    if (playersParam) {
      const players = JSON.parse(playersParam);
      const lives = new Array(players.length).fill(parsedLives);
      const powerUps = new Array(players.length).fill(null).map(() => ({
        fiftyFifty: false,
        freezeTime: false,
        joker: false
      }));

      setState(prev => ({
        ...prev,
        players,
        playerLives: lives,
        playerPowerUps: powerUps,
        initialTimer: parsedTimer,
        secondsLeft: parsedTimer,
        selectedCategory: categoryParam,
        powerUpsEnabled: powerUpsParam === "true"
      }));
    }

    fetchQuestions(categoryParam);
  }, [setState]);

  useEffect(() => {
    if (!countdownPaused && state.secondsLeft > 0 && currentQuestion) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, secondsLeft: prev.secondsLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (state.secondsLeft === 0) {
      setState(prev => ({ ...prev, showAnswer: true }));
    }
  }, [state.secondsLeft, countdownPaused, currentQuestion, setState]);

  useEffect(() => {
    if (getAlivePlayersCount(state.playerLives) === 1) {
      const finalRanking = state.players.map((name, index) => ({
        name,
        lives: state.playerLives[index],
      })).sort((a, b) => b.lives - a.lives);

      const encoded = encodeURIComponent(JSON.stringify(finalRanking));
      router.push(`/result?ranking=${encoded}`);
    }
  }, [state.playerLives, state.players, router]);

useEffect(() => {
  if (state.currentQuestionIndex >= state.sessionQuestions.length && state.sessionQuestions.length > 0) {
    toast.info("Alle Fragen verbraucht, lade neue Fragen...");
    fetchQuestions(state.selectedCategory);
    // Reset auf die erste Frage:
    setState(prev => ({
      ...prev,
      currentQuestionIndex: 0,
      showAnswer: false,
      secondsLeft: prev.initialTimer
    }));
  }
}, [state.currentQuestionIndex, state.sessionQuestions.length, state.selectedCategory, setState]);



  const handleFiftyFifty = () => {
    if (state.playerPowerUps[state.currentPlayerIndex]?.fiftyFifty) return;

    markPowerUpAsUsed("fiftyFifty");
    const hint = currentQuestion?.answer.slice(0, Math.ceil(currentQuestion.answer.length / 2)) + "...";
    toast.info(`Hinweis: ${hint}`);
  };

  const handleFreezeTime = () => {
    if (state.playerPowerUps[state.currentPlayerIndex]?.freezeTime) return;

    markPowerUpAsUsed("freezeTime");
    toast.info("Zeit eingefroren für 5 Sekunden!");
    setCountdownPaused(true);
    setTimeout(() => {
      setCountdownPaused(false);
      toast.info("Zeit läuft weiter!");
    }, 5000);
  };

  const handleJoker = () => {
    if (state.playerPowerUps[state.currentPlayerIndex]?.joker) return;

    markPowerUpAsUsed("joker");
    toast.success(`${state.players[state.currentPlayerIndex]} hat den Joker eingesetzt!`);
    handleCorrectAnswer();
  };

  const handleSkip = () => {
    resetTimer();
    setState(prev => ({ ...prev, showAnswer: false }));
    handleCorrectAnswer();
  };

  if (!currentQuestion) {
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
        currentPlayer={state.players[state.currentPlayerIndex]}
        currentPlayerLives={state.playerLives[state.currentPlayerIndex]}
        isSetup={false}
        powerUpsEnabled={state.powerUpsEnabled}
        setPowerUpsEnabled={() => {}}
        selectedCategory={state.selectedCategory}
        setSelectedCategory={() => {}}
      />

      {state.powerUpsEnabled && (
        <PowerUpComponent
          onFiftyFifty={handleFiftyFifty}
          onFreezeTime={handleFreezeTime}
          onJoker={handleJoker}
          usedPowerUps={state.playerPowerUps[state.currentPlayerIndex]}
        />
      )}

      <p className="mt-6 text-6xl tracking-widest text-red">{state.secondsLeft}</p>

      <div className="flex-1 flex flex-col items-center justify-center">
        <GameCard content={state.showAnswer ? `Antwort: ${currentQuestion.answer}` : currentQuestion.question} />

        <div 
          onClick={() => setState(prev => ({ ...prev, showAnswer: !prev.showAnswer }))}
          className="w-[70px] h-[70px] flex items-center justify-center shadow bg-blue mt-12 cursor-pointer rounded-full">
          <ArrowRightLeftIcon className="text-white w-8" />
        </div>

        {state.showAnswer && (
          <div className="mt-12 p-2 w-md flex flex-row items-center justify-center gap-8">
            <div
              onClick={handleCorrectAnswer}
              className="flex w-[120px] items-center justify-around p-2 bg-green text-white rounded-lg cursor-pointer shadow-xl hover:scale-105 transition-all">
              <Check />
              <p className="text-xl tracking-wider">Richtig</p>
            </div>

            <div
              onClick={handleWrongAnswer}
              className="flex w-[120px] items-center justify-around p-2 bg-red text-white rounded-lg cursor-pointer shadow-xl hover:scale-105 transition-all">
              <X />
              <p className="text-xl tracking-wider">Falsch</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;

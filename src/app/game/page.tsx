"use client";

import GameCard from "@/components/GameCard";
import GameHeader from "@/components/GameHeader";
import PowerUpComponent from "@/components/PowerUpComponent";
import { ArrowRightLeftIcon, Check, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Game = () => {

    const [players, setPlayers] = useState<string[]>([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [playerLives, setPlayerLives] = useState<number[]>([]);
    const [initialTimer, setInitialTimer] = useState(15);

    const [secondsLeft, setSecondsLeft] = useState(15);
    const [showAnswer, setShowAnswer] = useState(false);

    const [sessionQuestions, setSessionQuestions] = useState<{ question: string; answer: string }[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const [powerUpsEnabled, setPowerUpsEnabled] = useState(false);
    const [playerPowerUps, setPlayerPowerUps] = useState<{
      fiftyFifty: boolean,
      freezeTime: boolean,
      joker: boolean
    }[]>([]);

    const [selectedCategory, setSelectedCategory] = useState("Allgemeinwissen");

    const [countdownPaused, setCountdownPaused] = useState(false);

    const fetchQuestions = async (category: string) => {
        try {
          const res = await fetch('/api/v1/getQuestions', { method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({category})});
          if (!res.ok) throw new Error('Fehler beim Abrufen der Fragen');
          const data = await res.json();
          setSessionQuestions(data.questions);
          setIsLoading(false);
        } catch (error) {
          console.error(error);
        }
    };

    // Get Players Name from URI & Fetch Questions
    useEffect(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const playersParam = searchParams.get("players");
      const timerParam = searchParams.get("timer");
      const livesParam = searchParams.get("lives");
      const powerUpsParam = searchParams.get("powerUps");
      const categoryParam = searchParams.get("category");

      const parsedTimer = timerParam ? parseInt(timerParam) : 15;
      const parsedLives = livesParam ? parseInt(livesParam) : 3;

      setInitialTimer(parsedTimer);
      setSecondsLeft(parsedTimer);
      setPowerUpsEnabled(powerUpsParam === "true");

      if (playersParam) {
        const parsedPlayers = JSON.parse(playersParam);
        setPlayers(parsedPlayers);
        setPlayerLives(new Array(parsedPlayers.length).fill(parsedLives));
        setPlayerPowerUps(
          new Array(parsedPlayers.length).fill(null).map(() => ({
            fiftyFifty: false,
            freezeTime: false,
            joker: false
          }))
        );
      }
      

      if (categoryParam) {
        setSelectedCategory(categoryParam);
        fetchQuestions(categoryParam);
      } else {
        fetchQuestions("Allgemeinwissen");
      }

    }, []);


    // Timer
    useEffect(() => {

      if (isLoading || sessionQuestions.length === 0) return;

      if (secondsLeft === 0) {
        setShowAnswer(true);
        return;
      }

      if (countdownPaused) return;

      const timer = setTimeout(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }, [secondsLeft, isLoading, sessionQuestions, countdownPaused]);

    const markPowerUpAsUsed = (powerUp: keyof (typeof playerPowerUps)[number]) => {
      setPlayerPowerUps(prev => {
        const updated = [...prev];
        updated[currentPlayerIndex][powerUp] = true;
        return updated;
      });
    }

    const handleFiftyFifty = () => {
      if (playerPowerUps[currentPlayerIndex].fiftyFifty) return;

      console.log("50:50 used");
      markPowerUpAsUsed('fiftyFifty');

      const currentAnswer = sessionQuestions[currentQuestionIndex]?.answer;
      if (currentAnswer) {
        const hint = currentAnswer.slice(0, Math.ceil(currentAnswer.length / 2)) + '...';
        toast.info(`Hinweis: ${hint}`);
      }
    }

    const handleFreezeTime = () => {
      if (playerPowerUps[currentPlayerIndex].freezeTime) return;

      markPowerUpAsUsed('freezeTime');

      toast.info("Zeit eingefroren für 5 Sekunden!");
      setCountdownPaused(true);

      setTimeout(() => {
        setCountdownPaused(false);
        toast.info("Zeit läuft weiter!");
      }, 5000);
    }

    const handleJoker = () => {
       if (playerPowerUps[currentPlayerIndex].joker) return;

      console.log("Joker used!");
      markPowerUpAsUsed('joker');

      toast.success(`${players[currentPlayerIndex]} hat den Joker eingesetezt! Automatisch korrekt.`);
      handleCorrect();
    }

    const fetchNewQuestions = async () => {
      try {
          const res = await fetch('/api/v1/getQuestions', { method: 'POST', headers: { 'Content-Type': 'application/json'}, body: JSON.stringify({category: selectedCategory}) });
          if (!res.ok) throw new Error('Fehler beim Abrufen der Fragen');
          const data = await res.json();
          setSessionQuestions(data.questions);
          setCurrentQuestionIndex(0); 
          setSecondsLeft(initialTimer);
          setShowAnswer(false);
      } catch (error) {
        console.log(error);
      }
    }

    const getAlivePlayersCount = () => {
      return playerLives.filter(lives => lives > 0).length;
    };


    // Navigation
    const nextPlayer = () => {

      if (getAlivePlayersCount() === 1) {
        const finalRanking = players.map((name, index) => ({
          name,
          lives: playerLives[index],
        })).sort((a, b) => b.lives - a.lives);

        const encoded = encodeURIComponent(JSON.stringify(finalRanking));
        router.push(`/result?ranking=${encoded}`);
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
          toast.info("Alle Fragen verbraucht, lade neue Fragen...");
          await fetchNewQuestions();
        } else {
          console.log("Spielende: Nur noch ein Spieler lebt.");
        }
      } else {
        setCurrentQuestionIndex(nextIndex);
        setSecondsLeft(initialTimer);
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
      setSecondsLeft(initialTimer);
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
        currentPlayerLives={playerLives[currentPlayerIndex]}
        isSetup={false}
        onSave={(timer) => {
          setInitialTimer(timer);
        }}
        powerUpsEnabled={powerUpsEnabled}
        setPowerUpsEnabled={setPowerUpsEnabled}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}/>

        {powerUpsEnabled && (
          <PowerUpComponent
            onFiftyFifty={handleFiftyFifty}
            onFreezeTime={handleFreezeTime}
            onJoker={handleJoker}
            usedPowerUps={playerPowerUps[currentPlayerIndex]}
          />
        )}

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
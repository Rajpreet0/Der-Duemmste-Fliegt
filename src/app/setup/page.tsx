"use client";

import GameHeader from "@/components/GameHeader";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { validatePlayerCount, initializePlayerNames, validatePlayerNames } from "@/features/setup/setupLogic";

const SetupPage = () => {
  const [step, setStep] = useState(1);
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [playerNames, setPlayerNames] = useState<string[]>([]);
  const [timer, setTimer] = useState(15);
  const [lives, setLives] = useState(3);
  const [powerUpsEnabled, setPowerUpsEnabled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Allgemeinwissen");

  const router = useRouter();

  const handlePlayerCountSubmit = () => {
    if (!validatePlayerCount(playerCount)) {
      toast.warning("Bitte gib eine gültige Anzahl an Spielern ein (1-8)");
      return;
    }
    setPlayerNames(initializePlayerNames(playerCount));
    setStep(2);
  };

  const handleNameChange = (index: number, value: string) => {
    const updated = [...playerNames];
    updated[index] = value;
    setPlayerNames(updated);
  };

  const startGame = () => {
    if (!validatePlayerNames(playerNames)) {
      toast.warning("Bitte alle Spielernamen ausfüllen");
      return;
    }

    router.push(`/game?players=${encodeURIComponent(JSON.stringify(playerNames))}&timer=${timer}&lives=${lives}&powerUps=${powerUpsEnabled}&category=${selectedCategory}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <GameHeader 
        isSetup 
        onSave={(newTimer, newLives) => {
          setTimer(newTimer);
          setLives(newLives);
        }}
        powerUpsEnabled={powerUpsEnabled}
        setPowerUpsEnabled={setPowerUpsEnabled}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="flex-1 flex flex-col items-center justify-center">
        {step === 1 && (
          <>
            <h2 className="mb-20 text-4xl text-blue">Wie viele Spieler werden spielen?</h2>
            <div className="flex w-full items-center justify-center gap-4">
              <input
                type="number"
                value={playerCount}
                readOnly
                className="w-[100px] h-[100px] bg-blue/50 border-2 border-blue/20 text-center rounded-lg text-white text-3xl"
              />
              <div className="flex flex-col gap-4">
                <div onClick={() => setPlayerCount(pc => Math.min(pc + 1, 8))} className="bg-green/20 rounded-md p-2 cursor-pointer">
                  <Plus className="text-blue" />
                </div>
                <div onClick={() => setPlayerCount(pc => Math.max(pc - 1, 0))} className="bg-red/20 rounded-md p-2 cursor-pointer">
                  <Minus className="text-blue" />
                </div>
              </div>
            </div>
            <button
              onClick={handlePlayerCountSubmit}
              className="mt-20 text-xl bg-yellow text-white tracking-wider py-2 px-8 rounded-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all"
            >
              Weiter
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="mb-16 text-4xl text-blue">Spielernamen eintragen</h2>
            {playerNames.map((name, index) => (
              <div key={index} className="flex gap-4 items-center mt-4">
                <label className="text-lg tracking-wide">Player {index + 1}:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  className="bg-blue/50 border-2 border-blue/20 p-2 tracking-wider rounded-lg text-white text-xl"
                />
              </div>
            ))}
            <button
              onClick={startGame}
              className="mt-20 text-xl bg-yellow text-white tracking-wider py-2 px-8 rounded-lg cursor-pointer hover:scale-105 hover:shadow-xl transition-all"
            >
              Spiel starten
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SetupPage;

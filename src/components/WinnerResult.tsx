"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConfettiExploading from "react-confetti-explosion";
import ResultPlayerCard from "./ResultPlayerCard";
import { parseRanking, PlayerResult } from "@/features/result/resultLogic";

export default function WinnerResult() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isExploding, setIsExploding] = useState(false);
  const [ranking, setRanking] = useState<PlayerResult[]>([]);

  useEffect(() => {
    const raw = searchParams.get("ranking");
    const parsed = parseRanking(raw);
    setRanking(parsed);
    setIsExploding(true);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      {isExploding && (
        <ConfettiExploading
          particleCount={200}
          duration={3000}
          width={1600}
          force={0.8}
        />
      )}
      <p className="mb-12 text-4xl tracking-wider">Ergebnissliste:</p>
      {ranking.map((player, index) => (
        <ResultPlayerCard
          key={player.name}
          resultPlace={index + 1}
          playerName={player.name}
        />
      ))}
      <div className="mt-12">
        <button
          onClick={() => router.push("/")}
          className="p-4 text-xl tracking-wider bg-yellow rounded-lg text-white hover:scale-105 transition-all cursor-pointer"
        >
          Wiederholen
        </button>
      </div>
    </div>
  );
}

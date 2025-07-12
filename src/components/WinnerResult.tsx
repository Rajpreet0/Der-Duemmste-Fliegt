"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConfettiExploading from "react-confetti-explosion";
import ResultPlayerCard from "./ResultPlayerCard";

interface PlayerResult {
    name: string;
    lives: number;
}

export default function WinnerResult() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [isExploading, setIsExploding] = useState(false);
    const [ranking, setRanking] = useState<PlayerResult[]>([]);


    useEffect(() => {
        const raw = searchParams.get("ranking");

        if (raw) {
            const parsed: PlayerResult[] = JSON.parse(decodeURIComponent(raw));
            setRanking(parsed);
        }
        setIsExploding(true);
    }, [searchParams]);

   

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            {isExploading && 
                <ConfettiExploading
                    particleCount={200}
                    duration={3000}
                    width={1600}
                    force={0.8}/>
            }
            <p className="mb-12 text-4xl tracking-wider ">Ergebnissliste:</p>
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
                    className="p-4 text-xl tracking-wider bg-yellow rounded-lg text-white hover:scale-105 transition-all cursor-pointer">Wiederholen</button>
            </div>
        </div>
    );
}

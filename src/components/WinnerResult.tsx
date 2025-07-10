"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function WinnerResult() {
    const searchParams = useSearchParams();
    const winner = searchParams.get("winner");

    const router = useRouter();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold mb-4 text-green-600">🎉 Spiel beendet!</h1>
            <p className="text-2xl">Der Gewinner ist:</p>
            <p className="text-3xl mt-2 font-semibold text-blue-600">{winner}</p>

            <div className="mt-12">
                <button
                    onClick={() => router.push("/")} 
                    className="p-4 text-xl tracking-wider bg-yellow rounded-lg text-white hover:scale-105 transition-all cursor-pointer">Wiederholen</button>
            </div>
        </div>
    );
}

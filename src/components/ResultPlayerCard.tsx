import React from "react";

interface ResultPlayerCardProps {
    resultPlace: number;
    playerName: string;
}

const ResultPlayerCard: React.FC<ResultPlayerCardProps> = ({resultPlace, playerName}) => {
  return (
    <div className={`w-[250px] h-[50px] p-4 rounded-full flex items-center mt-6
        ${resultPlace === 1 ? "scale-125 bg-[#EFBF04] border-2 border-[#EFBF04]/40 shadow-xl" : ""}
        ${resultPlace === 2 ? "scale-115 bg-[#C4C4C4] border-2 border-[#C4C4C4]/40 shadow-xl" : ""}
        ${resultPlace === 3 ? "scale-105 bg-[#CE8946] border-2 border-[#CE8946]/40 shadow-xl" : ""}`}>
        <div>
            <p className=" rounded-full p-2 text-2xl">{resultPlace}.</p>
        </div>

        <p className="text-center w-full text-2xl font-bold">{playerName}</p>
    </div>
  )
}

export default ResultPlayerCard
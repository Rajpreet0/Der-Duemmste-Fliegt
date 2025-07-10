import { Inter } from "next/font/google";

interface GameCardProps {
    content: string;
}

const inter = Inter({
  subsets: ["latin"],
});

const GameCard: React.FC<GameCardProps> = ({content}) => {
  return (
    <div className={`${inter.className} w-xl h-[20vh] flex items-center justify-center text-center bg-white/80 rounded-lg shadow-xl cursor-pointer`}>
        <p className="text-2xl break-words">{content}</p>
      
    </div>
  )
}

export default GameCard
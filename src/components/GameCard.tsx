import { Inter } from "next/font/google";

interface GameCardProps {
    content: string;
}

const inter = Inter({
  subsets: ["latin"],
});

const GameCard: React.FC<GameCardProps> = ({content}) => {
  return (
    <div
      className={`
        ${inter.className}
        w-[90%] max-w-xl
        min-h-[120px] sm:min-h-[150px] md:min-h-[180px] lg:min-h-[200px]
        flex items-center justify-center text-center
        bg-white/80 rounded-lg shadow-xl cursor-pointer
        p-4 sm:p-6 md:p-8
        transition-transform hover:scale-[1.02]
      `}
    >
      <p
        className="
          text-lg sm:text-xl md:text-2xl lg:text-3xl
          break-words
        "
      >
        {content}
      </p>
    </div>
  )
}

export default GameCard
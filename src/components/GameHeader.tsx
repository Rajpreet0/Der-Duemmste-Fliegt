import Image from "next/image";
import Logo from "../../public/images/Logo.png";
import { Heart, HeartOff, Settings, SkipForward } from "lucide-react";
import TooltipComponent from "./TooltipComponent";

interface GameHeaderProps {
  isSetup?: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({isSetup}) => {
  return (
    <div className="w-full flex flex-row items-center justify-between p-2">
      <Image
        src={Logo}
        alt="Game Logo"
        width={120}
        height={120}
      />
      {!isSetup && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-3xl tracking-wider text-blue">Rajpreet</p>
          <div className="flex gap-2 items-center mt-1">
            <Heart className="text-red w-5" fill="#D74A37"/>
            <Heart className="text-red w-5" fill="#D74A37"/>
            <Heart className="text-red w-5" fill="#D74A37"/>
          </div>
        </div>
      )}
      <div className="flex gap-4 items-center">
        {!isSetup && (
          <TooltipComponent content="Frage überspringen">
            <div className="bg-blue p-2 rounded-full text-white cursor-pointer hover:scale-105 transition-all">
                <SkipForward/>
            </div>
          </TooltipComponent>
        )}
          <TooltipComponent content="Einstellungen">
            <div className="bg-blue p-2 rounded-full text-white cursor-pointer hover:scale-105 transition-all">
              <Settings/>
            </div>
          </TooltipComponent>
      </div>
    </div>
  )
}

export default GameHeader
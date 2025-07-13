import { CircleSlash2, Snowflake } from "lucide-react";
import JokerIcon from "../../public/images/icons/joker.png";
import Image from "next/image";
import TooltipComponent from "./TooltipComponent";

interface PowerUpComponentProps {
    onFiftyFifty: () => void;
    onFreezeTime: () => void;
    onJoker: () => void;
    usedPowerUps: {
        fiftyFifty: boolean;
        freezeTime: boolean;
        joker: boolean;
    }
}

const PowerUpComponent: React.FC<PowerUpComponentProps> = ({onFiftyFifty, onFreezeTime, onJoker, usedPowerUps}) => {
  return (
    <div className="fixed bottom-4 md:left-10 md:top-[45%] z-10">
      <div className="flex flex-row items-center gap-3  md:flex-col  md:gap-4">
        <button
          onClick={onFiftyFifty}
          disabled={usedPowerUps.fiftyFifty}
          className={`bg-blue p-2 md:p-3 rounded-full cursor-pointer hover:scale-105 transition-all ${
            usedPowerUps.fiftyFifty ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <TooltipComponent content="50:50">
            <CircleSlash2 className="text-white w-5 h-5 md:w-6 md:h-6" />
          </TooltipComponent>
        </button>

        <button
          onClick={onFreezeTime}
          disabled={usedPowerUps.freezeTime}
          className={`bg-blue p-2 md:p-3 rounded-full cursor-pointer hover:scale-105 transition-all ${
            usedPowerUps.freezeTime ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <TooltipComponent content="Zeit einfrieren">
            <Snowflake className="text-white w-5 h-5 md:w-6 md:h-6" />
          </TooltipComponent>
        </button>

        <button
          onClick={onJoker}
          disabled={usedPowerUps.joker}
          className={`bg-blue p-2 md:p-3 rounded-full cursor-pointer hover:scale-105 transition-all ${
            usedPowerUps.joker ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <TooltipComponent content="Joker">
            <Image
              src={JokerIcon}
              alt="jokerIcon"
              className="text-white w-5 h-5 md:w-6 md:h-6"
            />
          </TooltipComponent>
        </button>
      </div>
    </div>
  );
};

export default PowerUpComponent;
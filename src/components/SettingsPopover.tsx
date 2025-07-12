"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react"

interface SettingsPopoverProps {
    children: React.ReactNode;
    isGame: boolean;
    onSave?: (timer: number, lives: number) => void;
}

const SettingsPopover: React.FC<SettingsPopoverProps> = ({children, isGame, onSave}) => {
    const [timerValue, setTimerValue] = useState(15);
    const [livesValue, setLivesValue] = useState(3);
    const router = useRouter();

    const increment = (value: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
        setter(prev => prev + 1);
    }

    const decrement = (value: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
        if (value > 1) setter(prev => prev - 1);
    }

    const handleSave = () => {
        if (onSave) {
            onSave(timerValue, livesValue);
            alert("Saved");
            return;
        }
    }
  return (
    <Popover>
        <PopoverTrigger>{children}</PopoverTrigger>
        <PopoverContent>
            <div className="w-full flex flex-col items-center justify-center p-2 gap-4">
                {/* TIMER */}
                <div className="w-full flex items-center justify-between">
                    <p className="text-xl tracking-wider">Timer</p>
                    <div className="flex items-center gap-2">
                        <Minus 
                            onClick={() => decrement(timerValue, setTimerValue)}
                            className="text-blue cursor-pointer hover:bg-black/10 hover:rounded-full"/>
                        <input className="w-[30px] text-center  text-xl"
                                value={timerValue}
                                readOnly/>
                        <Plus
                            onClick={() => increment(timerValue, setTimerValue)} 
                            className="text-blue cursor-pointer hover:bg-black/10 hover:rounded-full"/>
                    </div>
                </div>

                {/* LIVES */}
                <div className="w-full flex items-center justify-between">
                    <p className="text-xl tracking-wider">Leben</p>
                    <div className="flex items-center gap-2">
                        <Minus 
                             onClick={() => decrement(livesValue, setLivesValue)}
                             className="text-blue cursor-pointer hover:bg-black/10 hover:rounded-full"/>
                        <input className="w-[30px] text-center  text-xl"
                               value={livesValue}
                               readOnly/>
                        <Plus 
                            onClick={() => increment(livesValue, setLivesValue)}
                            className="text-blue cursor-pointer hover:bg-black/10 hover:rounded-full"/>
                    </div>
                </div>

            {isGame ? (
             <button
                onClick={() => router.push("/")}
                className="p-2 rounded-lg bg-red px-8 text-white tracking-widest mt-2 cursor-pointer">Aufgeben</button>
            ) : (
             <button
                    onClick={handleSave}
                    className="p-2 rounded-lg bg-yellow px-8 text-white tracking-widest mt-2  cursor-pointer">Save</button>
            )}
            </div>
        </PopoverContent>
    </Popover>
  )
}

export default SettingsPopover
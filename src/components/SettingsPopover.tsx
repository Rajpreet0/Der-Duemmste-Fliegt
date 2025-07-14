"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react"
import { toast } from "sonner";
import { Switch } from "./ui/switch";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "./ui/dropdown-menu";

interface SettingsPopoverProps {
    children: React.ReactNode;
    isGame: boolean;
    onSave?: (timer: number, lives: number) => void;
    powerUpsEnabled?: boolean;
    setPowerUpsEnabled?: (enabled: boolean) => void;
    selectedCategory?: string;
    setSelectedCategory?: (category: string) => void;
}

const SettingsPopover: React.FC<SettingsPopoverProps> = ({
    children, 
    isGame, 
    onSave, 
    powerUpsEnabled, 
    setPowerUpsEnabled,
    selectedCategory,
    setSelectedCategory}) => {
    const [timerValue, setTimerValue] = useState(15);
    const [livesValue, setLivesValue] = useState(3);
    const router = useRouter();
    
    const categories = ["Allgemeinwissen", "Sport", "Wissenschaft", "Geschichte", "Film&Musik"]
    

    const difficulty = ["Leicht", "Medium", "Hard"]
    const [selectedDiffculty, setSelectedDiffculty] = useState("Medium");

    const modus = ["Klassisch", "Quiz", "Level-Up", "Knockdown"];
    const [selectedModus, setSelectedModus] = useState("Quiz");

    const increment = (value: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
        setter(prev => prev + 1);
    }

    const decrement = (value: number, setter: React.Dispatch<React.SetStateAction<number>>) => {
        if (value > 1) setter(prev => prev - 1);
    }

    const handleSave = () => {
        if (onSave) {
            onSave(timerValue, livesValue);
            toast.success("Saved");
            return;
        }
    }
  return (
    <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent>
            <div className="w-full flex flex-col items-center justify-center p-2 gap-4 ">
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



                {/* CATEGORY */}
                <div className="w-full flex items-center justify-between">
                    <p className="text-xl tracking-wider">Kategorie</p>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="p-2 bg-blue text-white rounded-md cursor-pointer tracking-wider"
                                >{selectedCategory}</button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                {categories.map((category) => (
                                    <DropdownMenuItem
                                        key={category}
                                        onClick={() => setSelectedCategory?.(category)}
                                        className={selectedCategory === category ? "bg-blue text-white" : ""}>
                                            {category}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>


                {/* DIFFICULTY */}
                <div className="w-full flex items-center justify-between">
                    <p className="text-xl tracking-wider">Schwierigkeit</p>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="p-2 bg-blue text-white rounded-md cursor-pointer  tracking-wider"
                                >{selectedDiffculty}</button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                {difficulty.map((diffcult) => (
                                    <DropdownMenuItem
                                        key={diffcult}
                                        onClick={() => setSelectedDiffculty(diffcult)}
                                        className={selectedDiffculty === diffcult ? "bg-blue text-white" : ""}>
                                            {diffcult}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* MODUS */}
                <div className="w-full flex items-center justify-between">
                    <p className="text-xl tracking-wider">Modus</p>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className="p-2 bg-blue text-white rounded-md cursor-pointer tracking-wider"
                                >{selectedModus}</button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                {modus.map((modi) => (
                                    <DropdownMenuItem
                                        key={modi}
                                        onClick={() => setSelectedModus(modi)}
                                        className={selectedModus === modi ? "bg-blue text-white" : ""}>
                                            {modi}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* SWITCH */}
                <div className="w-full flex items-center justify-between">
                    <p className="text-xl tracking-wider">Power-Ups</p>
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={powerUpsEnabled}
                            onCheckedChange={(checked) => setPowerUpsEnabled?.(checked)} 
                            className="cursor-pointer"/>
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
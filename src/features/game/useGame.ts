import { useState } from "react";
import { GameState, PlayerPowerUps, Question } from "./gameTypes";
import { decrementLives, nextPlayerIndex } from "./gameLogic";

export function useGame(initialState: Partial<GameState> = {}) {
    const [state, setState] = useState<GameState>({
        players: [],
        currentPlayerIndex: 0,
        playerLives: [],
        playerPowerUps: [],
        sessionQuestions: [],
        currentQuestionIndex: 0,
        initialTimer: 15,
        secondsLeft: 15,
        selectedCategory: "Allgemeinwissen",
        powerUpsEnabled: false,
        showAnswer: false,
        ...initialState
    })

    const markPowerUpAsUsed = (powerUp: keyof PlayerPowerUps) => {
        setState(prev => {
            const updatedPowerUps = [...prev.playerPowerUps];
            updatedPowerUps[prev.currentPlayerIndex][powerUp] = true;
            return { ...prev, playerPowerUps: updatedPowerUps };
        });
    };

    const handleCorrectAnswer = () => {
        setState(prev => ({
            ...prev,
            showAnswer: false
        }));
        nextTurn();
    }

    const handleWrongAnswer = () => {
        setState(prev => ({
            ...prev,
            playerLives: decrementLives(prev.playerLives, prev.currentPlayerIndex),
            showAnswer: false,
        }));
        nextTurn();
    }

    
    const nextTurn = () => {
    setState(prev => {
        const nextIndex = prev.currentQuestionIndex + 1;

        if (nextIndex >= prev.sessionQuestions.length) {
        return {
            ...prev,
            currentQuestionIndex: prev.sessionQuestions.length, // Triggert den useEffect
        };
        }

        const nextPlayer = nextPlayerIndex(prev.players, prev.playerLives, prev.currentPlayerIndex);

        return {
        ...prev,
        currentPlayerIndex: nextPlayer,
        currentQuestionIndex: nextIndex,
        secondsLeft: prev.initialTimer,
        showAnswer: false
        };
    });
    };


    const resetTimer = () => {
        setState(prev => ({
        ...prev,
        secondsLeft: prev.initialTimer
        }));
    };

    const loadQuestions = (questions: Question[]) => {
        setState(prev => ({
        ...prev,
        sessionQuestions: questions,
        currentQuestionIndex: 0
        }));
    };

    return {
        state,
        markPowerUpAsUsed,
        handleCorrectAnswer,
        handleWrongAnswer,
        nextTurn,
        resetTimer,
        loadQuestions,
        setState
    };
}
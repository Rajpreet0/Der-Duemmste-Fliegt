export interface Question {
    question: string;
    answer: string;
}

export interface PlayerPowerUps {
    fiftyFifty: boolean;
    freezeTime: boolean;
    joker: boolean;
}

export interface GameState {
    players: string[];
    currentPlayerIndex: number;
    playerLives: number[];
    playerPowerUps: PlayerPowerUps[];
    sessionQuestions: Question[];
    currentQuestionIndex: number;
    initialTimer: number;
    secondsLeft: number;
    selectedCategory: string;
    powerUpsEnabled: boolean;
    showAnswer: boolean;
}
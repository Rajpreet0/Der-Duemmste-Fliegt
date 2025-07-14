
export function getAlivePlayersCount(lives: number[]): number {
  return lives.filter(l => l > 0).length;
}

export function nextPlayerIndex(players: string[], lives: number[], currentIndex: number): number {
    let nextIndex = currentIndex;
    for (let i = 0; i < players.length; i++) {
        nextIndex = (nextIndex + 1) % players.length;
        if (lives[nextIndex] > 0) break;
    }
    return nextIndex;
}

export function decrementLives(lives: number[], index: number): number[] {
    const updated = [...lives];
    updated[index] -= 1;
    return updated;
}
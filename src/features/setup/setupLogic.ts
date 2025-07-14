export function validatePlayerCount(playerCount: number): boolean {
  return playerCount > 0 && playerCount <= 8;
}

export function initializePlayerNames(count: number): string[] {
  return Array(count).fill("");
}

export function validatePlayerNames(names: string[]): boolean {
  return names.every(name => name.trim() !== "");
}

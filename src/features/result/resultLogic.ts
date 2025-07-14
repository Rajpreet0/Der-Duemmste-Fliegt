export interface PlayerResult {
  name: string;
  lives: number;
}

export function parseRanking(raw: string | null): PlayerResult[] {
  if (!raw) return [];
  try {
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return [];
  }
}

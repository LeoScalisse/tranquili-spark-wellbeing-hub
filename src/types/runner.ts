
export interface Position {
  x: number;
  y: number;
}

export interface GameObject extends Position {
  id: string;
  width: number;
  height: number;
  type: string;
}

export interface Player extends GameObject {
  lane: number;
  isJumping: boolean;
  isInZenMode: boolean;
  hasShield: boolean;
}

export interface Collectible extends GameObject {
  points: number;
  collected: boolean;
}

export interface Obstacle extends GameObject {
  passed: boolean;
}

export interface PowerUp extends GameObject {
  effect: 'zen' | 'shield' | 'levitation';
  duration: number;
  used: boolean;
}

export type SceneryType = 'garden' | 'forest' | 'sky';

export interface GameStats {
  score: number;
  distance: number;
  calmBubbles: number;
  lightRays: number;
  focusSymbols: number;
  currentScenery: SceneryType;
}

export interface RunnerGameState {
  isPlaying: boolean;
  isPaused: boolean;
  gameSpeed: number;
  player: Player;
  obstacles: Obstacle[];
  collectibles: Collectible[];
  powerUps: PowerUp[];
  stats: GameStats;
}

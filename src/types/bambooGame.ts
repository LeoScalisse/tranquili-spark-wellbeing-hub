
export interface BambooBlock {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  isMoving: boolean;
  direction: 1 | -1;
  speed: number;
}

export interface BambooGameState {
  blocks: BambooBlock[];
  currentBlock: BambooBlock | null;
  score: number;
  height: number;
  gameOver: boolean;
  isPaused: boolean;
  mode: 'contemplative' | 'harmony' | 'flow';
  stability: number;
  wind: number;
  perfectPlacements: number;
}

export interface BambooGameConfig {
  baseWidth: number;
  blockHeight: number;
  initialSpeed: number;
  maxSpeed: number;
  windStrength: number;
  stabilityThreshold: number;
}

export interface BambooGameProgress {
  highestTower: number;
  totalBlocks: number;
  perfectPlacements: number;
  gamesPlayed: number;
  unlockedThemes: string[];
  unlockedModes: string[];
  lastPlayDate: string;
}


export interface PlantElement {
  id: string;
  type: PlantType;
  category: PlantCategory;
  icon: string;
  frequency: number;
  timbre: OscillatorType;
  unlocked: boolean;
  name: string;
}

export interface PlantedElement {
  id: string;
  elementId: string;
  position: number;
  plantedAt: number;
}

export interface GameStats {
  plantsPlanted: number;
  melodiesCreated: number;
  totalTouches: number;
  timeSpent: number;
  startTime: number;
}

export interface GameProgress {
  unlockedElements: string[];
  milestones: string[];
  level: number;
}

export interface GardenGameState {
  grid: (PlantedElement | null)[];
  stats: GameStats;
  progress: GameProgress;
  mode: GameMode;
}

export type PlantCategory = 
  | 'flowers' 
  | 'bell-plants' 
  | 'crystal-plants' 
  | 'trees-leaves'
  | 'aquatic-plants'
  | 'rock-plants'
  | 'wind-plants'
  | 'mystic-plants'
  | 'musical-plants'
  | 'elemental-plants';

export type PlantType = string;

export type GameMode = 'free' | 'harmony' | 'flow';

export interface Milestone {
  id: string;
  name: string;
  description: string;
  requirement: number;
  type: 'plants' | 'touches' | 'melodies';
  unlocks: string[];
}

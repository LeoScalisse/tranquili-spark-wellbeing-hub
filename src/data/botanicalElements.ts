
import { PlantElement, PlantCategory, Milestone } from '@/types/botanicalGarden';

const frequencies = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50, D6: 1174.66, E6: 1318.51, F6: 1396.91, G6: 1567.98, A6: 1760.00
};

export const botanicalElements: PlantElement[] = [
  // Flores (8) - Início desbloqueado
  { id: 'flower-1', type: 'cherry-blossom', category: 'flowers', icon: '🌸', frequency: frequencies.C4, timbre: 'sine', unlocked: true, name: 'Flor de Cerejeira' },
  { id: 'flower-2', type: 'rose', category: 'flowers', icon: '🌹', frequency: frequencies.E4, timbre: 'sine', unlocked: false, name: 'Rosa Melódica' },
  { id: 'flower-3', type: 'tulip', category: 'flowers', icon: '🌷', frequency: frequencies.G4, timbre: 'sine', unlocked: false, name: 'Tulipa Harmônica' },
  { id: 'flower-4', type: 'daisy', category: 'flowers', icon: '🌼', frequency: frequencies.A4, timbre: 'sine', unlocked: false, name: 'Margarida Doce' },
  { id: 'flower-5', type: 'hibiscus', category: 'flowers', icon: '🌺', frequency: frequencies.C5, timbre: 'sine', unlocked: false, name: 'Hibisco Vibrante' },
  { id: 'flower-6', type: 'sunflower', category: 'flowers', icon: '🌻', frequency: frequencies.D5, timbre: 'sine', unlocked: false, name: 'Girassol Radiante' },
  { id: 'flower-7', type: 'lotus', category: 'flowers', icon: '🪷', frequency: frequencies.F5, timbre: 'sine', unlocked: false, name: 'Lótus Serena' },
  { id: 'flower-8', type: 'wheat', category: 'flowers', icon: '🌾', frequency: frequencies.G5, timbre: 'sine', unlocked: false, name: 'Trigo Dourado' },

  // Plantas com Sinos (6) - Uma desbloqueada
  { id: 'bell-1', type: 'herb-bell', category: 'bell-plants', icon: '🌿', frequency: frequencies.D4, timbre: 'triangle', unlocked: true, name: 'Erva dos Sinos' },
  { id: 'bell-2', type: 'sprout-bell', category: 'bell-plants', icon: '🌱', frequency: frequencies.F4, timbre: 'triangle', unlocked: false, name: 'Broto Cristalino' },
  { id: 'bell-3', type: 'bamboo-bell', category: 'bell-plants', icon: '🎋', frequency: frequencies.B4, timbre: 'triangle', unlocked: false, name: 'Bambu Musical' },
  { id: 'bell-4', type: 'reed-bell', category: 'bell-plants', icon: '🌾', frequency: frequencies.E5, timbre: 'triangle', unlocked: false, name: 'Junco Ressonante' },
  { id: 'bell-5', type: 'mint-bell', category: 'bell-plants', icon: '🌿', frequency: frequencies.A5, timbre: 'triangle', unlocked: false, name: 'Menta Celestial' },
  { id: 'bell-6', type: 'sage-bell', category: 'bell-plants', icon: '🌱', frequency: frequencies.B5, timbre: 'triangle', unlocked: false, name: 'Sálvia Etérea' },

  // Plantas Cristalinas (6) - Uma desbloqueada
  { id: 'crystal-1', type: 'cactus-crystal', category: 'crystal-plants', icon: '🌵', frequency: frequencies.F4, timbre: 'sawtooth', unlocked: true, name: 'Cacto de Cristal' },
  { id: 'crystal-2', type: 'succulent-crystal', category: 'crystal-plants', icon: '🪴', frequency: frequencies.A4, timbre: 'sawtooth', unlocked: false, name: 'Suculenta Prismática' },
  { id: 'crystal-3', type: 'jade-plant', category: 'crystal-plants', icon: '🌵', frequency: frequencies.D5, timbre: 'sawtooth', unlocked: false, name: 'Jade Ressonante' },
  { id: 'crystal-4', type: 'crystal-fern', category: 'crystal-plants', icon: '🪴', frequency: frequencies.F5, timbre: 'sawtooth', unlocked: false, name: 'Samambaia Cristalizada' },
  { id: 'crystal-5', type: 'quartz-moss', category: 'crystal-plants', icon: '🌵', frequency: frequencies.G5, timbre: 'sawtooth', unlocked: false, name: 'Musgo de Quartzo' },
  { id: 'crystal-6', type: 'gem-vine', category: 'crystal-plants', icon: '🪴', frequency: frequencies.C6, timbre: 'sawtooth', unlocked: false, name: 'Videira Gema' },

  // Árvores/Folhas (6)
  { id: 'tree-1', type: 'maple-leaf', category: 'trees-leaves', icon: '🍃', frequency: frequencies.G4, timbre: 'square', unlocked: false, name: 'Folha de Bordo' },
  { id: 'tree-2', type: 'bamboo-tree', category: 'trees-leaves', icon: '🎋', frequency: frequencies.B4, timbre: 'square', unlocked: false, name: 'Bambu Ancestral' },
  { id: 'tree-3', type: 'autumn-leaf', category: 'trees-leaves', icon: '🍁', frequency: frequencies.C5, timbre: 'square', unlocked: false, name: 'Folha de Outono' },
  { id: 'tree-4', type: 'oak-tree', category: 'trees-leaves', icon: '🌳', frequency: frequencies.E5, timbre: 'square', unlocked: false, name: 'Carvalho Sábio' },
  { id: 'tree-5', type: 'pine-tree', category: 'trees-leaves', icon: '🌲', frequency: frequencies.A5, timbre: 'square', unlocked: false, name: 'Pinheiro Melodioso' },
  { id: 'tree-6', type: 'fern-leaf', category: 'trees-leaves', icon: '🌿', frequency: frequencies.D6, timbre: 'square', unlocked: false, name: 'Samambaia Sussurrante' },

  // Plantas Aquáticas (6)
  { id: 'aquatic-1', type: 'water-lily', category: 'aquatic-plants', icon: '🪷', frequency: frequencies.C4, timbre: 'sine', unlocked: false, name: 'Lírio d\'Água' },
  { id: 'aquatic-2', type: 'sea-grass', category: 'aquatic-plants', icon: '🌾', frequency: frequencies.E4, timbre: 'triangle', unlocked: false, name: 'Grama Marinha' },
  { id: 'aquatic-3', type: 'coral-plant', category: 'aquatic-plants', icon: '🪷', frequency: frequencies.G4, timbre: 'sine', unlocked: false, name: 'Planta Coral' },
  { id: 'aquatic-4', type: 'kelp-forest', category: 'aquatic-plants', icon: '🌾', frequency: frequencies.B4, timbre: 'triangle', unlocked: false, name: 'Floresta de Algas' },
  { id: 'aquatic-5', type: 'pond-lotus', category: 'aquatic-plants', icon: '🪷', frequency: frequencies.D5, timbre: 'sine', unlocked: false, name: 'Lótus do Lago' },
  { id: 'aquatic-6', type: 'ocean-wave', category: 'aquatic-plants', icon: '🌊', frequency: frequencies.F5, timbre: 'triangle', unlocked: false, name: 'Onda do Oceano' },

  // Plantas Rochosas (5)
  { id: 'rock-1', type: 'stone-moss', category: 'rock-plants', icon: '🌵', frequency: frequencies.D4, timbre: 'sawtooth', unlocked: false, name: 'Musgo da Pedra' },
  { id: 'rock-2', type: 'cliff-fern', category: 'rock-plants', icon: '🪴', frequency: frequencies.F4, timbre: 'sawtooth', unlocked: false, name: 'Samambaia do Penhasco' },
  { id: 'rock-3', type: 'granite-flower', category: 'rock-plants', icon: '🌵', frequency: frequencies.A4, timbre: 'sawtooth', unlocked: false, name: 'Flor de Granito' },
  { id: 'rock-4', type: 'mountain-herb', category: 'rock-plants', icon: '🪴', frequency: frequencies.C5, timbre: 'sawtooth', unlocked: false, name: 'Erva da Montanha' },
  { id: 'rock-5', type: 'crystal-cave', category: 'rock-plants', icon: '🌵', frequency: frequencies.E5, timbre: 'sawtooth', unlocked: false, name: 'Caverna de Cristal' },

  // Plantas do Vento (4)
  { id: 'wind-1', type: 'wind-chime', category: 'wind-plants', icon: '🌾', frequency: frequencies.G4, timbre: 'triangle', unlocked: false, name: 'Carrilhão do Vento' },
  { id: 'wind-2', type: 'breeze-grass', category: 'wind-plants', icon: '🌿', frequency: frequencies.B4, timbre: 'triangle', unlocked: false, name: 'Grama da Brisa' },
  { id: 'wind-3', type: 'zephyr-leaf', category: 'wind-plants', icon: '🍃', frequency: frequencies.D5, timbre: 'triangle', unlocked: false, name: 'Folha do Zéfiro' },
  { id: 'wind-4', type: 'storm-reed', category: 'wind-plants', icon: '🌾', frequency: frequencies.G5, timbre: 'triangle', unlocked: false, name: 'Junco da Tempestade' },

  // Plantas Místicas (4)
  { id: 'mystic-1', type: 'moon-flower', category: 'mystic-plants', icon: '🌙', frequency: frequencies.C5, timbre: 'sine', unlocked: false, name: 'Flor da Lua' },
  { id: 'mystic-2', type: 'star-moss', category: 'mystic-plants', icon: '🌟', frequency: frequencies.E5, timbre: 'triangle', unlocked: false, name: 'Musgo das Estrelas' },
  { id: 'mystic-3', type: 'rainbow-fern', category: 'mystic-plants', icon: '🌈', frequency: frequencies.A5, timbre: 'square', unlocked: false, name: 'Samambaia do Arco-íris' },
  { id: 'mystic-4', type: 'cosmic-bloom', category: 'mystic-plants', icon: '✨', frequency: frequencies.C6, timbre: 'sine', unlocked: false, name: 'Flor Cósmica' },

  // Plantas Musicais (3)
  { id: 'musical-1', type: 'melody-bamboo', category: 'musical-plants', icon: '🎋', frequency: frequencies.F5, timbre: 'triangle', unlocked: false, name: 'Bambu Melódico' },
  { id: 'musical-2', type: 'harmony-herb', category: 'musical-plants', icon: '🌿', frequency: frequencies.A5, timbre: 'sine', unlocked: false, name: 'Erva da Harmonia' },
  { id: 'musical-3', type: 'rhythm-reed', category: 'musical-plants', icon: '🌾', frequency: frequencies.D6, timbre: 'square', unlocked: false, name: 'Junco do Ritmo' },

  // Plantas Elementais (3)
  { id: 'elemental-1', type: 'fire-bloom', category: 'elemental-plants', icon: '🌺', frequency: frequencies.B5, timbre: 'sawtooth', unlocked: false, name: 'Flor de Fogo' },
  { id: 'elemental-2', type: 'earth-sprout', category: 'elemental-plants', icon: '🌱', frequency: frequencies.E6, timbre: 'square', unlocked: false, name: 'Broto da Terra' },
  { id: 'elemental-3', type: 'air-leaf', category: 'elemental-plants', icon: '🍃', frequency: frequencies.A6, timbre: 'triangle', unlocked: false, name: 'Folha do Ar' }
];

export const milestones: Milestone[] = [
  { id: 'first-garden', name: 'Primeiro Jardim', description: 'Plante sua primeira planta!', requirement: 1, type: 'plants', unlocks: ['flower-2'] },
  { id: 'small-garden', name: 'Jardim Pequeno', description: 'Plante 3 elementos', requirement: 3, type: 'plants', unlocks: ['bell-2', 'crystal-2'] },
  { id: 'growing-garden', name: 'Jardim Crescente', description: 'Plante 5 elementos', requirement: 5, type: 'plants', unlocks: ['tree-1', 'flower-3'] },
  { id: 'melody-maker', name: 'Criador de Melodias', description: 'Toque 50 vezes nas plantas', requirement: 50, type: 'touches', unlocks: ['musical-1', 'mystic-1'] },
  { id: 'flourishing-garden', name: 'Jardim Florescente', description: 'Plante 10 elementos', requirement: 10, type: 'plants', unlocks: ['aquatic-1', 'wind-1', 'flower-4'] },
  { id: 'botanical-explorer', name: 'Explorador Botânico', description: 'Plante 15 elementos', requirement: 15, type: 'plants', unlocks: ['rock-1', 'tree-2', 'bell-3'] },
  { id: 'harmony-master', name: 'Mestre da Harmonia', description: 'Toque 100 vezes nas plantas', requirement: 100, type: 'touches', unlocks: ['musical-2', 'elemental-1'] },
  { id: 'garden-sage', name: 'Sábio do Jardim', description: 'Plante 25 elementos', requirement: 25, type: 'plants', unlocks: ['mystic-2', 'mystic-3', 'aquatic-2'] },
  { id: 'master-gardener', name: 'Jardineiro Mestre', description: 'Plante 35 elementos', requirement: 35, type: 'plants', unlocks: ['elemental-2', 'musical-3'] },
  { id: 'zen-master', name: 'Mestre Zen', description: 'Toque 200 vezes nas plantas', requirement: 200, type: 'touches', unlocks: ['elemental-3', 'mystic-4'] },
  { id: 'garden-complete', name: 'Jardim Completo', description: 'Desbloqueie todos os elementos!', requirement: 50, type: 'plants', unlocks: [] }
];

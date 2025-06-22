
import { useState, useEffect, useCallback, useRef } from 'react';
import { GardenGameState, PlantedElement, GameStats, PlantElement } from '@/types/botanicalGarden';
import { botanicalElements } from '@/data/botanicalElements';

const GRID_SIZE = 50;
const STORAGE_KEY = 'botanical-garden-save';

const initialState: GardenGameState = {
  grid: Array(GRID_SIZE).fill(null),
  stats: {
    plantsPlanted: 0,
    melodiesCreated: 0,
    totalTouches: 0,
    timeSpent: 0,
    startTime: Date.now()
  },
  progress: {
    unlockedElements: ['flower-1', 'bell-1', 'crystal-1'],
    milestones: [],
    level: 1
  },
  mode: 'free'
};

export const useBotanicalGarden = () => {
  const [gameState, setGameState] = useState<GardenGameState>(initialState);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const timeUpdateRef = useRef<NodeJS.Timeout>();

  // Inicializar áudio
  useEffect(() => {
    const initAudio = () => {
      if (!audioContext) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
      }
    };

    const handleFirstInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [audioContext]);

  // Carregar estado salvo
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setGameState({ ...parsed, stats: { ...parsed.stats, startTime: Date.now() } });
      } catch (error) {
        console.error('Erro ao carregar jogo salvo:', error);
      }
    }
  }, []);

  // Salvar estado automaticamente
  useEffect(() => {
    const saveState = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    };

    const timeoutId = setTimeout(saveState, 1000);
    return () => clearTimeout(timeoutId);
  }, [gameState]);

  // Atualizar tempo de jogo
  useEffect(() => {
    timeUpdateRef.current = setInterval(() => {
      setGameState(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          timeSpent: prev.stats.timeSpent + 1
        }
      }));
    }, 1000);

    return () => {
      if (timeUpdateRef.current) {
        clearInterval(timeUpdateRef.current);
      }
    };
  }, []);

  // Tocar som da planta
  const playPlantSound = useCallback((element: PlantElement) => {
    if (!audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = element.timbre;
      oscillator.frequency.setValueAtTime(element.frequency, audioContext.currentTime);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);

      // Vibração em dispositivos móveis
      if ('vibrate' in navigator) {
        navigator.vibrate(100);
      }
    } catch (error) {
      console.error('Erro ao reproduzir som:', error);
    }
  }, [audioContext]);

  // Desbloquear novos elementos baseado na quantidade plantada
  const unlockNewElements = useCallback((plantsPlanted: number) => {
    const currentUnlocked = gameState.progress.unlockedElements.length;
    const shouldUnlock = Math.floor(plantsPlanted / 3); // A cada 3 plantas plantadas
    const newUnlockCount = Math.min(shouldUnlock + 3, botanicalElements.length); // +3 iniciais

    if (newUnlockCount > currentUnlocked) {
      const newElements = botanicalElements.slice(0, newUnlockCount).map(el => el.id);
      return newElements;
    }
    
    return gameState.progress.unlockedElements;
  }, [gameState.progress.unlockedElements]);

  // Plantar elemento
  const plantElement = useCallback((position: number) => {
    if (gameState.grid[position] !== null) return;

    const unlockedElements = botanicalElements.filter(el => 
      gameState.progress.unlockedElements.includes(el.id)
    );

    if (unlockedElements.length === 0) return;

    const randomElement = unlockedElements[Math.floor(Math.random() * unlockedElements.length)];
    
    const newPlant: PlantedElement = {
      id: `plant-${Date.now()}-${position}`,
      elementId: randomElement.id,
      position,
      plantedAt: Date.now()
    };

    // Tocar som imediatamente ao plantar
    playPlantSound(randomElement);

    setGameState(prev => {
      const newGrid = [...prev.grid];
      newGrid[position] = newPlant;

      const newStats = {
        ...prev.stats,
        plantsPlanted: prev.stats.plantsPlanted + 1,
        totalTouches: prev.stats.totalTouches + 1, // Contar o plantio como um toque
        melodiesCreated: Math.floor((prev.stats.totalTouches + 1) / 10)
      };

      const newUnlockedElements = unlockNewElements(newStats.plantsPlanted);

      return {
        ...prev,
        grid: newGrid,
        stats: newStats,
        progress: {
          ...prev.progress,
          unlockedElements: newUnlockedElements
        }
      };
    });
  }, [gameState.grid, gameState.progress.unlockedElements, playPlantSound, unlockNewElements]);

  // Tocar planta existente
  const touchPlant = useCallback((position: number) => {
    const plant = gameState.grid[position];
    if (!plant) return;

    const element = botanicalElements.find(el => el.id === plant.elementId);
    if (!element) return;

    playPlantSound(element);

    setGameState(prev => {
      const newStats = {
        ...prev.stats,
        totalTouches: prev.stats.totalTouches + 1,
        melodiesCreated: Math.floor((prev.stats.totalTouches + 1) / 10)
      };

      return {
        ...prev,
        stats: newStats
      };
    });
  }, [gameState.grid, playPlantSound]);

  // Mudar modo de jogo
  const changeGameMode = useCallback((mode: 'free' | 'harmony' | 'flow') => {
    setGameState(prev => ({ ...prev, mode }));
  }, []);

  // Reset do jogo
  const resetGarden = useCallback(() => {
    setGameState(initialState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    gameState,
    plantElement,
    touchPlant,
    changeGameMode,
    resetGarden,
    availableElements: botanicalElements.filter(el => 
      gameState.progress.unlockedElements.includes(el.id)
    ),
    progressPercentage: Math.min((gameState.stats.plantsPlanted / GRID_SIZE) * 100, 100)
  };
};

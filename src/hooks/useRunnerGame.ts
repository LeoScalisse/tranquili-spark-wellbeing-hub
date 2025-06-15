
import { useState, useCallback, useRef, useEffect } from 'react';
import { RunnerGameState, Position, Collectible, Obstacle, PowerUp, SceneryType } from '@/types/runner';
import { useAudio } from '@/contexts/AudioContext';
import { useUser } from '@/contexts/UserContext';

const INITIAL_PLAYER = {
  id: 'player',
  x: 200,
  y: 300,
  width: 40,
  height: 60,
  type: 'player',
  lane: 1, // 0=esquerda, 1=centro, 2=direita
  isJumping: false,
  isInZenMode: false,
  hasShield: false
};

const INITIAL_STATS = {
  score: 0,
  distance: 0,
  calmBubbles: 0,
  lightRays: 0,
  focusSymbols: 0,
  currentScenery: 'garden' as SceneryType
};

export const useRunnerGame = () => {
  const { playRunnerCollectSound, playRunnerObstacleSound, playRunnerPowerUpSound } = useAudio();
  const { addXP } = useUser();
  
  const [gameState, setGameState] = useState<RunnerGameState>({
    isPlaying: false,
    isPaused: false,
    gameSpeed: 2,
    player: INITIAL_PLAYER,
    obstacles: [],
    collectibles: [],
    powerUps: [],
    stats: INITIAL_STATS
  });

  const gameLoopRef = useRef<number>();
  const lastSpawnRef = useRef<number>(0);

  const generateCollectible = useCallback((yPos: number): Collectible => {
    const types = ['calm', 'light', 'focus'];
    const type = types[Math.floor(Math.random() * types.length)];
    const lane = Math.floor(Math.random() * 3);
    
    return {
      id: `collectible-${Date.now()}-${Math.random()}`,
      x: 100 + (lane * 100),
      y: yPos,
      width: 20,
      height: 20,
      type,
      points: type === 'calm' ? 10 : type === 'light' ? 20 : 30,
      collected: false
    };
  }, []);

  const generateObstacle = useCallback((yPos: number): Obstacle => {
    const types = ['stress', 'thought', 'distraction'];
    const type = types[Math.floor(Math.random() * types.length)];
    const lane = Math.floor(Math.random() * 3);
    
    return {
      id: `obstacle-${Date.now()}-${Math.random()}`,
      x: 100 + (lane * 100),
      y: yPos,
      width: 30,
      height: 40,
      type,
      passed: false
    };
  }, []);

  const generatePowerUp = useCallback((yPos: number): PowerUp => {
    const effects = ['zen', 'shield', 'levitation'] as const;
    const effect = effects[Math.floor(Math.random() * effects.length)];
    const lane = Math.floor(Math.random() * 3);
    
    return {
      id: `powerup-${Date.now()}-${Math.random()}`,
      x: 100 + (lane * 100),
      y: yPos,
      width: 25,
      height: 25,
      type: 'powerup',
      effect,
      duration: 5000,
      used: false
    };
  }, []);

  const checkCollision = useCallback((obj1: Position & { width: number; height: number }, obj2: Position & { width: number; height: number }) => {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
  }, []);

  const movePlayer = useCallback((direction: 'left' | 'right' | 'jump') => {
    setGameState(prev => {
      if (!prev.isPlaying || prev.isPaused) return prev;
      
      let newPlayer = { ...prev.player };
      
      if (direction === 'left' && newPlayer.lane > 0) {
        newPlayer.lane -= 1;
        newPlayer.x = 100 + (newPlayer.lane * 100);
      } else if (direction === 'right' && newPlayer.lane < 2) {
        newPlayer.lane += 1;
        newPlayer.x = 100 + (newPlayer.lane * 100);
      } else if (direction === 'jump' && !newPlayer.isJumping) {
        newPlayer.isJumping = true;
        setTimeout(() => {
          setGameState(current => ({
            ...current,
            player: { ...current.player, isJumping: false }
          }));
        }, 600);
      }
      
      return { ...prev, player: newPlayer };
    });
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      player: INITIAL_PLAYER,
      obstacles: [],
      collectibles: [],
      powerUps: [],
      stats: INITIAL_STATS
    }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const endGame = useCallback(() => {
    setGameState(prev => {
      // Adicionar XP baseado na pontuação
      const xpEarned = Math.floor(prev.stats.score / 100);
      if (xpEarned > 0) {
        addXP(xpEarned);
      }
      
      return { ...prev, isPlaying: false, isPaused: false };
    });
  }, [addXP]);

  // Game loop principal
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isPaused) {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      return;
    }

    const gameLoop = () => {
      setGameState(prev => {
        const newState = { ...prev };
        const currentTime = Date.now();
        
        // Atualizar distância e velocidade
        newState.stats.distance += newState.gameSpeed;
        newState.stats.score += 1;
        
        // Aumentar velocidade gradualmente
        if (newState.stats.distance % 1000 === 0 && newState.gameSpeed < 5) {
          newState.gameSpeed += 0.1;
        }
        
        // Mudar cenário baseado na distância
        const sceneryIndex = Math.floor(newState.stats.distance / 2000) % 3;
        const sceneries: SceneryType[] = ['garden', 'forest', 'sky'];
        newState.stats.currentScenery = sceneries[sceneryIndex];
        
        // Spawnar novos objetos
        if (currentTime - lastSpawnRef.current > 1500) {
          const spawnY = -50;
          
          if (Math.random() < 0.7) {
            newState.collectibles.push(generateCollectible(spawnY));
          }
          
          if (Math.random() < 0.4) {
            newState.obstacles.push(generateObstacle(spawnY));
          }
          
          if (Math.random() < 0.1) {
            newState.powerUps.push(generatePowerUp(spawnY));
          }
          
          lastSpawnRef.current = currentTime;
        }
        
        // Mover objetos
        newState.collectibles = newState.collectibles.map(c => ({ ...c, y: c.y + newState.gameSpeed }));
        newState.obstacles = newState.obstacles.map(o => ({ ...o, y: o.y + newState.gameSpeed }));
        newState.powerUps = newState.powerUps.map(p => ({ ...p, y: p.y + newState.gameSpeed }));
        
        // Verificar colisões com coletáveis
        newState.collectibles.forEach(collectible => {
          if (!collectible.collected && checkCollision(newState.player, collectible)) {
            collectible.collected = true;
            newState.stats.score += collectible.points;
            
            if (collectible.type === 'calm') newState.stats.calmBubbles++;
            else if (collectible.type === 'light') newState.stats.lightRays++;
            else if (collectible.type === 'focus') newState.stats.focusSymbols++;
            
            playRunnerCollectSound();
          }
        });
        
        // Verificar colisões com obstáculos
        if (!newState.player.hasShield && !newState.player.isJumping) {
          newState.obstacles.forEach(obstacle => {
            if (!obstacle.passed && checkCollision(newState.player, obstacle)) {
              playRunnerObstacleSound();
              // Game over ou perder vida
              newState.isPlaying = false;
            }
          });
        }
        
        // Verificar colisões com power-ups
        newState.powerUps.forEach(powerUp => {
          if (!powerUp.used && checkCollision(newState.player, powerUp)) {
            powerUp.used = true;
            playRunnerPowerUpSound();
            
            if (powerUp.effect === 'zen') {
              newState.player.isInZenMode = true;
              setTimeout(() => {
                setGameState(current => ({
                  ...current,
                  player: { ...current.player, isInZenMode: false }
                }));
              }, powerUp.duration);
            } else if (powerUp.effect === 'shield') {
              newState.player.hasShield = true;
              setTimeout(() => {
                setGameState(current => ({
                  ...current,
                  player: { ...current.player, hasShield: false }
                }));
              }, powerUp.duration);
            }
          }
        });
        
        // Remover objetos fora da tela
        newState.collectibles = newState.collectibles.filter(c => c.y < 600);
        newState.obstacles = newState.obstacles.filter(o => o.y < 600);
        newState.powerUps = newState.powerUps.filter(p => p.y < 600);
        
        return newState;
      });
      
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, checkCollision, generateCollectible, generateObstacle, generatePowerUp, playRunnerCollectSound, playRunnerObstacleSound, playRunnerPowerUpSound]);

  return {
    gameState,
    movePlayer,
    startGame,
    pauseGame,
    endGame
  };
};

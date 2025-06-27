
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Pause, Play, Settings, Trophy } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { useUser } from '@/contexts/UserContext';
import { useBreakpoint } from '@/hooks/use-mobile';
import { BambooGameState, BambooBlock, BambooGameConfig } from '@/types/bambooGame';

interface BambooTowerGameProps {
  onBack: () => void;
}

const BambooTowerGame: React.FC<BambooTowerGameProps> = ({ onBack }) => {
  const { playBambooSound, startGameAmbient, stopGameAmbient } = useAudio();
  const { user, updateGameProgress, addXP } = useUser();
  const { isMobile, isTablet } = useBreakpoint();
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Configurações responsivas
  const getGameConfig = (): BambooGameConfig => ({
    baseWidth: isMobile ? 300 : isTablet ? 400 : 500,
    blockHeight: isMobile ? 25 : 30,
    initialSpeed: isMobile ? 1.5 : 2,
    maxSpeed: isMobile ? 4 : 6,
    windStrength: 0.3,
    stabilityThreshold: 0.7
  });

  const config = getGameConfig();

  const [gameState, setGameState] = useState<BambooGameState>({
    blocks: [],
    currentBlock: null,
    score: 0,
    height: 0,
    gameOver: false,
    isPaused: false,
    mode: 'harmony',
    stability: 1,
    wind: 0,
    perfectPlacements: 0
  });

  const [showPauseMenu, setShowPauseMenu] = useState(false);

  // Inicializar jogo
  const initializeGame = useCallback(() => {
    const firstBlock: BambooBlock = {
      id: 0,
      x: 0,
      y: isMobile ? 400 : 500,
      width: config.baseWidth,
      height: config.blockHeight,
      color: '#8B7355',
      isMoving: false,
      direction: 1,
      speed: 0
    };

    const secondBlock: BambooBlock = {
      id: 1,
      x: -config.baseWidth,
      y: firstBlock.y - config.blockHeight,
      width: config.baseWidth,
      height: config.blockHeight,
      color: '#9D8F7F',
      isMoving: true,
      direction: 1,
      speed: config.initialSpeed
    };

    setGameState({
      blocks: [firstBlock],
      currentBlock: secondBlock,
      score: 0,
      height: 1,
      gameOver: false,
      isPaused: false,
      mode: 'harmony',
      stability: 1,
      wind: 0,
      perfectPlacements: 0
    });

    startGameAmbient('bamboo');
  }, [config, startGameAmbient, isMobile]);

  // Cores dos blocos de bambu
  const getBambooColor = (index: number): string => {
    const colors = [
      '#8B7355', // Marrom claro
      '#9D8F7F', // Bege
      '#7A9B76', // Verde claro
      '#A8C09A', // Verde suave
      '#D4C4A8', // Creme
      '#B5A48B'  // Marrom médio
    ];
    return colors[index % colors.length];
  };

  // Mover bloco atual
  const updateCurrentBlock = useCallback((deltaTime: number) => {
    if (!gameState.currentBlock || gameState.isPaused || gameState.gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    setGameState(prev => {
      if (!prev.currentBlock) return prev;

      const block = { ...prev.currentBlock };
      const windEffect = prev.wind * 0.5;
      
      block.x += (block.direction * block.speed + windEffect) * deltaTime * 60;

      // Rebater nas bordas
      if (block.x <= -block.width || block.x >= canvas.width) {
        block.direction *= -1;
        block.x = Math.max(-block.width + 1, Math.min(canvas.width - 1, block.x));
      }

      return {
        ...prev,
        currentBlock: block
      };
    });
  }, [gameState.currentBlock, gameState.isPaused, gameState.gameOver]);

  // Soltar bloco
  const dropBlock = useCallback(() => {
    if (!gameState.currentBlock || gameState.isPaused || gameState.gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    setGameState(prev => {
      if (!prev.currentBlock) return prev;

      const droppedBlock = { ...prev.currentBlock };
      const lastBlock = prev.blocks[prev.blocks.length - 1];
      
      // Calcular sobreposição
      const leftOverlap = Math.max(0, lastBlock.x - droppedBlock.x);
      const rightOverlap = Math.max(0, (droppedBlock.x + droppedBlock.width) - (lastBlock.x + lastBlock.width));
      const totalOverlap = leftOverlap + rightOverlap;
      
      if (totalOverlap >= droppedBlock.width) {
        // Torre caiu
        playBambooSound('fall');
        return {
          ...prev,
          gameOver: true,
          currentBlock: null
        };
      }

      // Ajustar bloco baseado na sobreposição
      droppedBlock.x = Math.max(droppedBlock.x + leftOverlap, lastBlock.x);
      droppedBlock.width = droppedBlock.width - totalOverlap;
      droppedBlock.isMoving = false;

      // Verificar se foi um encaixe perfeito
      const isPerfect = totalOverlap < 5;
      if (isPerfect) {
        playBambooSound('perfect');
      } else {
        playBambooSound('place');
      }

      // Calcular nova estabilidade
      const overlapRatio = Math.max(0, droppedBlock.width / config.baseWidth);
      const newStability = Math.min(1, (prev.stability + overlapRatio) / 2);

      // Criar próximo bloco
      const nextBlock: BambooBlock = {
        id: prev.height + 1,
        x: -droppedBlock.width,
        y: droppedBlock.y - config.blockHeight,
        width: droppedBlock.width,
        height: config.blockHeight,
        color: getBambooColor(prev.height + 1),
        isMoving: true,
        direction: 1,
        speed: Math.min(config.maxSpeed, config.initialSpeed + prev.height * 0.1)
      };

      // Atualizar progresso
      const newScore = prev.score + (isPerfect ? 100 : 50);
      const newHeight = prev.height + 1;

      return {
        ...prev,
        blocks: [...prev.blocks, droppedBlock],
        currentBlock: nextBlock,
        score: newScore,
        height: newHeight,
        stability: newStability,
        perfectPlacements: prev.perfectPlacements + (isPerfect ? 1 : 0),
        wind: prev.mode === 'flow' ? (Math.random() - 0.5) * config.windStrength : 0
      };
    });
  }, [gameState, playBambooSound, config, getBambooColor]);

  // Renderizar jogo
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fundo zen
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#E6F3E6');
    gradient.addColorStop(1, '#F0F8F0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar blocos
    gameState.blocks.forEach((block, index) => {
      ctx.fillStyle = block.color;
      ctx.strokeStyle = '#6B5B47';
      ctx.lineWidth = 1;
      
      // Sombra suave
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetY = 2;
      
      ctx.fillRect(block.x, block.y, block.width, block.height);
      ctx.strokeRect(block.x, block.y, block.width, block.height);
      
      // Textura de bambu
      ctx.strokeStyle = '#5A4A37';
      ctx.lineWidth = 0.5;
      for (let i = 1; i < 3; i++) {
        const lineY = block.y + (block.height / 3) * i;
        ctx.beginPath();
        ctx.moveTo(block.x, lineY);
        ctx.lineTo(block.x + block.width, lineY);
        ctx.stroke();
      }
    });

    // Desenhar bloco atual
    if (gameState.currentBlock) {
      const block = gameState.currentBlock;
      ctx.fillStyle = block.color;
      ctx.globalAlpha = 0.9;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 5;
      ctx.fillRect(block.x, block.y, block.width, block.height);
      ctx.strokeRect(block.x, block.y, block.width, block.height);
      ctx.globalAlpha = 1;
    }

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
  }, [gameState]);

  // Game loop
  const gameLoop = useCallback((timestamp: number) => {
    const deltaTime = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    updateCurrentBlock(deltaTime);
    render();

    if (!gameState.gameOver && !gameState.isPaused) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  }, [updateCurrentBlock, render, gameState.gameOver, gameState.isPaused]);

  // Controles
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space') {
      event.preventDefault();
      dropBlock();
    } else if (event.code === 'Escape') {
      setShowPauseMenu(prev => !prev);
    }
  }, [dropBlock]);

  const handleCanvasClick = useCallback(() => {
    dropBlock();
  }, [dropBlock]);

  // Effects
  useEffect(() => {
    initializeGame();
    return () => {
      stopGameAmbient();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeGame, stopGameAmbient]);

  useEffect(() => {
    if (!gameState.gameOver && !gameState.isPaused) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop, gameState.gameOver, gameState.isPaused]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Salvar progresso quando o jogo termina
  useEffect(() => {
    if (gameState.gameOver && user) {
      const progress = {
        highestTower: Math.max(user.gameProgress?.bambooTower?.highestTower || 0, gameState.height),
        totalBlocks: (user.gameProgress?.bambooTower?.totalBlocks || 0) + gameState.height,
        perfectPlacements: (user.gameProgress?.bambooTower?.perfectPlacements || 0) + gameState.perfectPlacements,
        gamesPlayed: (user.gameProgress?.bambooTower?.gamesPlayed || 0) + 1,
        unlockedThemes: user.gameProgress?.bambooTower?.unlockedThemes || ['default'],
        unlockedModes: user.gameProgress?.bambooTower?.unlockedModes || ['contemplative', 'harmony'],
        lastPlayDate: new Date().toISOString()
      };
      
      updateGameProgress('bambooTower', progress);
      addXP(gameState.score / 10);
    }
  }, [gameState.gameOver, gameState.height, gameState.score, gameState.perfectPlacements, user, updateGameProgress, addXP]);

  const canvasHeight = isMobile ? 500 : isTablet ? 600 : 700;
  const canvasWidth = isMobile ? 350 : isTablet ? 450 : 550;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "default"}
            onClick={onBack}
            className="min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {!isMobile && "Voltar"}
          </Button>
          
          <div className="text-center">
            <h1 className={`font-bold text-green-800 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              🎋 Torre de Bambu
            </h1>
            {!isMobile && (
              <p className="text-sm text-green-600">Construa com paciência e precisão</p>
            )}
          </div>
          
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "default"}
            onClick={() => setShowPauseMenu(true)}
            className="min-h-[44px]"
          >
            <Pause className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats Bar */}
        <div className={`grid gap-4 mb-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
          <Card className="glassmorphism">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-green-700">{gameState.height}</div>
              <div className="text-xs text-green-600">Altura</div>
            </CardContent>
          </Card>
          
          <Card className="glassmorphism">
            <CardContent className="p-3 text-center">
              <div className="text-lg font-bold text-amber-700">{gameState.score}</div>
              <div className="text-xs text-amber-600">Pontos</div>
            </CardContent>
          </Card>
          
          {!isMobile && (
            <>
              <Card className="glassmorphism">
                <CardContent className="p-3 text-center">
                  <div className="text-lg font-bold text-blue-700">{gameState.perfectPlacements}</div>
                  <div className="text-xs text-blue-600">Perfeitos</div>
                </CardContent>
              </Card>
              
              <Card className="glassmorphism">
                <CardContent className="p-3">
                  <div className="text-xs text-green-600 mb-1">Estabilidade</div>
                  <Progress value={gameState.stability * 100} className="h-2" />
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Game Canvas */}
        <div className="flex justify-center mb-4">
          <Card className="glassmorphism">
            <CardContent className="p-4">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                onClick={handleCanvasClick}
                className="border border-green-200 rounded-lg cursor-pointer bg-gradient-to-b from-green-50 to-green-100"
                style={{ touchAction: 'manipulation' }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="text-center space-y-2">
          <Button
            size={isMobile ? "lg" : "default"}
            onClick={dropBlock}
            disabled={gameState.gameOver || gameState.isPaused || !gameState.currentBlock}
            className="min-h-[44px] bg-green-600 hover:bg-green-700"
          >
            🎋 Soltar Bambu
          </Button>
          
          <p className="text-sm text-green-600">
            Toque para soltar • Espaço no teclado • Escape para pausar
          </p>
        </div>

        {/* Game Over Modal */}
        {gameState.gameOver && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardContent className="p-6 text-center space-y-4">
                <Trophy className="h-12 w-12 text-amber-500 mx-auto" />
                <h2 className="text-2xl font-bold text-green-800">Torre Finalizada!</h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Altura alcançada:</span>
                    <span className="font-bold">{gameState.height} blocos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pontuação:</span>
                    <span className="font-bold">{gameState.score} pontos</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Encaixes perfeitos:</span>
                    <span className="font-bold">{gameState.perfectPlacements}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={initializeGame} className="flex-1">
                    Jogar Novamente
                  </Button>
                  <Button variant="outline" onClick={onBack} className="flex-1">
                    Sair
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pause Menu */}
        {showPauseMenu && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardContent className="p-6 text-center space-y-4">
                <h2 className="text-xl font-bold text-green-800">Pausa</h2>
                <p className="text-green-600 italic">
                  "A precisão nasce da calma 🍃"
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setShowPauseMenu(false);
                      setGameState(prev => ({ ...prev, isPaused: false }));
                    }}
                    className="flex-1"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Continuar
                  </Button>
                  <Button variant="outline" onClick={onBack} className="flex-1">
                    Sair
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BambooTowerGame;

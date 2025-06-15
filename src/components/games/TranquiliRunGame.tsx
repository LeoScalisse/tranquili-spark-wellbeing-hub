
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, Square, Heart, Shield, Sparkles } from 'lucide-react';
import { useRunnerGame } from '@/hooks/useRunnerGame';
import { SceneryType } from '@/types/runner';

interface TranquiliRunGameProps {
  onBack: () => void;
}

const TranquiliRunGame: React.FC<TranquiliRunGameProps> = ({ onBack }) => {
  const { gameState, movePlayer, startGame, pauseGame, endGame } = useRunnerGame();

  // Controles do teclado
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.isPaused) return;
      
      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePlayer('right');
          break;
        case ' ':
        case 'ArrowUp':
        case 'w':
        case 'W':
          event.preventDefault();
          movePlayer('jump');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying, gameState.isPaused, movePlayer]);

  const getSceneryStyle = (scenery: SceneryType): string => {
    const baseStyle = "min-h-[400px] transition-all duration-1000 ";
    switch (scenery) {
      case 'garden':
        return baseStyle + "bg-gradient-to-b from-green-100 to-blue-100";
      case 'forest':
        return baseStyle + "bg-gradient-to-b from-green-200 to-purple-100";
      case 'sky':
        return baseStyle + "bg-gradient-to-b from-blue-200 to-pink-100";
      default:
        return baseStyle + "bg-gradient-to-b from-blue-100 to-green-100";
    }
  };

  const getCollectibleIcon = (type: string): string => {
    switch (type) {
      case 'calm': return '💙';
      case 'light': return '☀️';
      case 'focus': return '🧠';
      default: return '✨';
    }
  };

  const getObstacleIcon = (type: string): string => {
    switch (type) {
      case 'stress': return '☁️';
      case 'thought': return '🌀';
      case 'distraction': return '📱';
      default: return '⚡';
    }
  };

  const getPowerUpIcon = (effect: string): string => {
    switch (effect) {
      case 'zen': return '🧘';
      case 'shield': return '🛡️';
      case 'levitation': return '✨';
      default: return '⭐';
    }
  };

  if (!gameState.isPlaying && gameState.stats.score === 0) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="glassmorphism">
            <CardHeader className="flex-row items-center space-y-0 pb-4">
              <Button variant="ghost" size="icon" onClick={onBack} className="mr-4">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">
                <CardTitle className="text-2xl text-accent">🏃‍♂️ Tranquili Run+</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Um runner infinito relaxante com Tranquilinho
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-6xl animate-bounce">🧑‍🦱</div>
                <h2 className="text-xl font-semibold">Bem-vindo à Tranquilândia!</h2>
                <p className="text-muted-foreground">
                  Ajude o Tranquilinho a correr por paisagens relaxantes, 
                  coletando bolhas de calma e evitando o estresse.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-2xl mb-2">💙</div>
                  <h3 className="font-semibold text-sm">Bolhas de Calma</h3>
                  <p className="text-xs text-muted-foreground">+10 pontos</p>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl mb-2">☀️</div>
                  <h3 className="font-semibold text-sm">Raios de Leveza</h3>
                  <p className="text-xs text-muted-foreground">+20 pontos</p>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-2xl mb-2">🧠</div>
                  <h3 className="font-semibold text-sm">Símbolos de Foco</h3>
                  <p className="text-xs text-muted-foreground">+30 pontos</p>
                </Card>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Controles:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <Badge variant="outline">← → ou A/D: Mover</Badge>
                  <Badge variant="outline">↑ ou W/Espaço: Pular</Badge>
                  <Badge variant="outline">Toque: Controles móveis</Badge>
                </div>
              </div>

              <Button onClick={startGame} className="w-full text-lg py-6">
                <Play className="mr-2 h-5 w-5" />
                Começar Aventura Zen
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header com estatísticas */}
        <Card className="glassmorphism">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-4">
                <Badge variant="outline">Pontos: {gameState.stats.score}</Badge>
                <Badge variant="outline">💙 {gameState.stats.calmBubbles}</Badge>
                <Badge variant="outline">☀️ {gameState.stats.lightRays}</Badge>
                <Badge variant="outline">🧠 {gameState.stats.focusSymbols}</Badge>
              </div>
              
              <div className="flex gap-2">
                {gameState.isPlaying && (
                  <Button variant="outline" size="icon" onClick={pauseGame}>
                    {gameState.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </Button>
                )}
                <Button variant="outline" size="icon" onClick={endGame}>
                  <Square className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Área de jogo */}
        <Card className="glassmorphism overflow-hidden">
          <div className={getSceneryStyle(gameState.stats.currentScenery)} style={{ position: 'relative' }}>
            {/* Pistas de corrida */}
            <div className="absolute bottom-0 w-full h-20 bg-white/20 backdrop-blur-sm">
              <div className="grid grid-cols-3 h-full">
                <div className="border-r border-white/30"></div>
                <div className="border-r border-white/30"></div>
                <div></div>
              </div>
            </div>

            {/* Personagem Tranquilinho */}
            <div 
              className={`absolute transition-all duration-300 ${
                gameState.player.isJumping ? 'animate-bounce' : ''
              } ${gameState.player.isInZenMode ? 'animate-pulse' : ''}`}
              style={{
                left: `${gameState.player.x}px`,
                bottom: gameState.player.isJumping ? '100px' : '20px',
                width: '40px',
                height: '60px'
              }}
            >
              <div className="text-3xl relative">
                🧑‍🦱
                {gameState.player.hasShield && (
                  <div className="absolute -inset-2 text-yellow-400 animate-pulse">
                    <Shield className="w-8 h-8" />
                  </div>
                )}
                {gameState.player.isInZenMode && (
                  <div className="absolute -top-6 text-purple-400 animate-bounce">
                    <Sparkles className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>

            {/* Coletáveis */}
            {gameState.collectibles.filter(c => !c.collected).map(collectible => (
              <div
                key={collectible.id}
                className="absolute text-2xl animate-pulse"
                style={{
                  left: `${collectible.x}px`,
                  top: `${collectible.y}px`,
                  width: '20px',
                  height: '20px'
                }}
              >
                {getCollectibleIcon(collectible.type)}
              </div>
            ))}

            {/* Obstáculos */}
            {gameState.obstacles.map(obstacle => (
              <div
                key={obstacle.id}
                className="absolute text-3xl"
                style={{
                  left: `${obstacle.x}px`,
                  top: `${obstacle.y}px`,
                  width: '30px',
                  height: '40px'
                }}
              >
                {getObstacleIcon(obstacle.type)}
              </div>
            ))}

            {/* Power-ups */}
            {gameState.powerUps.filter(p => !p.used).map(powerUp => (
              <div
                key={powerUp.id}
                className="absolute text-2xl animate-spin"
                style={{
                  left: `${powerUp.x}px`,
                  top: `${powerUp.y}px`,
                  width: '25px',
                  height: '25px'
                }}
              >
                {getPowerUpIcon(powerUp.effect)}
              </div>
            ))}

            {/* Controles móveis */}
            <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-4 md:hidden">
              <Button 
                variant="outline" 
                size="icon"
                onTouchStart={() => movePlayer('left')}
                className="glassmorphism"
              >
                ←
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onTouchStart={() => movePlayer('jump')}
                className="glassmorphism"
              >
                ↑
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onTouchStart={() => movePlayer('right')}
                className="glassmorphism"
              >
                →
              </Button>
            </div>

            {/* Pausa overlay */}
            {gameState.isPaused && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Card className="glassmorphism p-6 text-center">
                  <h3 className="text-xl font-semibold mb-4">Jogo Pausado</h3>
                  <p className="text-muted-foreground mb-4">Respire fundo e relaxe 🧘‍♂️</p>
                  <Button onClick={pauseGame}>
                    <Play className="mr-2 h-4 w-4" />
                    Continuar
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </Card>

        {/* Game Over */}
        {!gameState.isPlaying && gameState.stats.score > 0 && (
          <Card className="glassmorphism">
            <CardContent className="p-6 text-center space-y-4">
              <h2 className="text-2xl font-semibold">Sessão de Tranquilidade Concluída! 🌟</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-bold text-accent">{gameState.stats.score}</div>
                  <div className="text-sm text-muted-foreground">Pontos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">{gameState.stats.calmBubbles}</div>
                  <div className="text-sm text-muted-foreground">Bolhas de Calma</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-500">{gameState.stats.lightRays}</div>
                  <div className="text-sm text-muted-foreground">Raios de Leveza</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-500">{gameState.stats.focusSymbols}</div>
                  <div className="text-sm text-muted-foreground">Símbolos de Foco</div>
                </div>
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={startGame}>
                  <Play className="mr-2 h-4 w-4" />
                  Jogar Novamente
                </Button>
                <Button variant="outline" onClick={onBack}>
                  Voltar ao Menu
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TranquiliRunGame;

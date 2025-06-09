
import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, RotateCcw, Heart, Zap, Coins } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { useUser } from '@/contexts/UserContext';

interface TranquiliRunnerGameProps {
  onBack: () => void;
}

interface GameState {
  playing: boolean;
  paused: boolean;
  gameOver: boolean;
  score: number;
  distance: number;
  lives: number;
  coins: number;
  calmBubbles: number;
  lightRays: number;
  focusSymbols: number;
  speed: number;
  powerUp: 'none' | 'breathe' | 'shield' | 'magnet';
  powerUpTime: number;
}

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'collectible' | 'obstacle' | 'powerup';
  subtype: string;
  color: string;
}

interface Player {
  x: number;
  y: number;
  lane: number; // 0, 1, 2
  jumping: boolean;
  sliding: boolean;
  jumpHeight: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const LANE_WIDTH = CANVAS_WIDTH / 3;
const PLAYER_SIZE = 40;
const GROUND_Y = CANVAS_HEIGHT - 80;

const environments = [
  { name: 'Jardim Zen', colors: ['#a8e6cf', '#88d8a3', '#4f9f7f'], theme: 'zen' },
  { name: 'Floresta dos Pensamentos', colors: ['#6b8e52', '#8fb069', '#a8cc7a'], theme: 'forest' },
  { name: 'Céu da Calma', colors: ['#87ceeb', '#b6e5ff', '#d4edff'], theme: 'sky' }
];

const TranquiliRunnerGame: React.FC<TranquiliRunnerGameProps> = ({ onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const keysRef = useRef<Set<string>>(new Set());
  
  const { playGameSound, playSuccessSound, playClickSound } = useAudio();
  const { addXP } = useUser();

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameOver'>('menu');
  const [game, setGame] = useState<GameState>({
    playing: false,
    paused: false,
    gameOver: false,
    score: 0,
    distance: 0,
    lives: 3,
    coins: 0,
    calmBubbles: 0,
    lightRays: 0,
    focusSymbols: 0,
    speed: 2,
    powerUp: 'none',
    powerUpTime: 0
  });

  const [player, setPlayer] = useState<Player>({
    x: 100,
    y: GROUND_Y,
    lane: 1,
    jumping: false,
    sliding: false,
    jumpHeight: 0
  });

  const [gameObjects, setGameObjects] = useState<GameObject[]>([]);
  const [currentEnvironment, setCurrentEnvironment] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('tranquili-runner-best');
    if (saved) {
      setBestScore(parseInt(saved));
    }
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    keysRef.current.add(event.key.toLowerCase());
    
    if (gameState === 'playing' && !game.paused) {
      switch (event.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (!player.jumping && !player.sliding) {
            setPlayer(prev => ({ ...prev, jumping: true, jumpHeight: 0 }));
            playGameSound('correct');
          }
          break;
        case 'arrowdown':
        case 's':
          if (!player.jumping && !player.sliding) {
            setPlayer(prev => ({ ...prev, sliding: true }));
            playGameSound('correct');
          }
          break;
        case 'arrowleft':
        case 'a':
          setPlayer(prev => ({ 
            ...prev, 
            lane: Math.max(0, prev.lane - 1),
            x: Math.max(0, prev.lane - 1) * LANE_WIDTH + LANE_WIDTH / 2 - PLAYER_SIZE / 2
          }));
          playClickSound();
          break;
        case 'arrowright':
        case 'd':
          setPlayer(prev => ({ 
            ...prev, 
            lane: Math.min(2, prev.lane + 1),
            x: Math.min(2, prev.lane + 1) * LANE_WIDTH + LANE_WIDTH / 2 - PLAYER_SIZE / 2
          }));
          playClickSound();
          break;
        case ' ':
          event.preventDefault();
          togglePause();
          break;
      }
    }
  }, [gameState, game.paused, player]);

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    keysRef.current.delete(event.key.toLowerCase());
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const startGame = () => {
    setGameState('playing');
    setGame({
      playing: true,
      paused: false,
      gameOver: false,
      score: 0,
      distance: 0,
      lives: 3,
      coins: 0,
      calmBubbles: 0,
      lightRays: 0,
      focusSymbols: 0,
      speed: 2,
      powerUp: 'none',
      powerUpTime: 0
    });
    setPlayer({
      x: LANE_WIDTH + LANE_WIDTH / 2 - PLAYER_SIZE / 2,
      y: GROUND_Y,
      lane: 1,
      jumping: false,
      sliding: false,
      jumpHeight: 0
    });
    setGameObjects([]);
    setCurrentEnvironment(0);
  };

  const togglePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
      setGame(prev => ({ ...prev, paused: !prev.paused }));
    } else if (gameState === 'paused') {
      setGameState('playing');
      setGame(prev => ({ ...prev, paused: false }));
    }
  };

  const endGame = () => {
    setGameState('gameOver');
    setGame(prev => ({ ...prev, gameOver: true }));
    
    if (game.score > bestScore) {
      setBestScore(game.score);
      localStorage.setItem('tranquili-runner-best', game.score.toString());
      playSuccessSound();
    }
    
    const xpEarned = Math.floor(game.score / 10) + game.calmBubbles * 2 + game.lightRays * 3;
    if (xpEarned > 0) {
      addXP(xpEarned);
    }
  };

  const spawnObject = () => {
    const lane = Math.floor(Math.random() * 3);
    const x = lane * LANE_WIDTH + LANE_WIDTH / 2 - 20;
    const rand = Math.random();
    
    let newObject: GameObject;
    
    if (rand < 0.4) {
      // Coletáveis
      if (rand < 0.15) {
        newObject = {
          x, y: GROUND_Y - 20, width: 25, height: 25,
          type: 'collectible', subtype: 'calm-bubble', color: '#38B6FF'
        };
      } else if (rand < 0.25) {
        newObject = {
          x, y: GROUND_Y - 20, width: 25, height: 25,
          type: 'collectible', subtype: 'light-ray', color: '#FFDE59'
        };
      } else {
        newObject = {
          x, y: GROUND_Y - 20, width: 25, height: 25,
          type: 'collectible', subtype: 'focus-symbol', color: '#9d4edd'
        };
      }
    } else if (rand < 0.7) {
      // Obstáculos
      if (rand < 0.55) {
        newObject = {
          x, y: GROUND_Y - 40, width: 40, height: 40,
          type: 'obstacle', subtype: 'stress-cloud', color: '#808080'
        };
      } else if (rand < 0.62) {
        newObject = {
          x, y: GROUND_Y - 30, width: 35, height: 35,
          type: 'obstacle', subtype: 'racing-thoughts', color: '#ff6b6b'
        };
      } else {
        newObject = {
          x, y: GROUND_Y - 35, width: 38, height: 38,
          type: 'obstacle', subtype: 'digital-distraction', color: '#4ecdc4'
        };
      }
    } else {
      // Power-ups
      if (rand < 0.75) {
        newObject = {
          x, y: GROUND_Y - 25, width: 30, height: 30,
          type: 'powerup', subtype: 'breathe-mode', color: '#a8e6cf'
        };
      } else if (rand < 0.85) {
        newObject = {
          x, y: GROUND_Y - 25, width: 30, height: 30,
          type: 'powerup', subtype: 'serenity-shield', color: '#ffd93d'
        };
      } else {
        newObject = {
          x, y: GROUND_Y - 25, width: 30, height: 30,
          type: 'powerup', subtype: 'zen-magnet', color: '#ff9ff3'
        };
      }
    }
    
    setGameObjects(prev => [...prev, newObject]);
  };

  const checkCollisions = () => {
    const playerRect = {
      x: player.x,
      y: player.y - player.jumpHeight + (player.sliding ? 20 : 0),
      width: PLAYER_SIZE,
      height: PLAYER_SIZE - (player.sliding ? 20 : 0)
    };

    setGameObjects(prev => prev.filter(obj => {
      const objRect = { x: obj.x, y: obj.y, width: obj.width, height: obj.height };
      
      if (playerRect.x < objRect.x + objRect.width &&
          playerRect.x + playerRect.width > objRect.x &&
          playerRect.y < objRect.y + objRect.height &&
          playerRect.y + playerRect.height > objRect.y) {
        
        if (obj.type === 'collectible') {
          setGame(prevGame => {
            let newGame = { ...prevGame };
            
            switch (obj.subtype) {
              case 'calm-bubble':
                newGame.calmBubbles += 1;
                newGame.score += 10;
                break;
              case 'light-ray':
                newGame.lightRays += 1;
                newGame.score += 15;
                break;
              case 'focus-symbol':
                newGame.focusSymbols += 1;
                newGame.coins += 5;
                newGame.score += 20;
                break;
            }
            
            return newGame;
          });
          playGameSound('correct');
          return false;
        } else if (obj.type === 'powerup') {
          setGame(prevGame => ({ 
            ...prevGame, 
            powerUp: obj.subtype.replace('-mode', '').replace('-shield', '').replace('zen-', '') as any,
            powerUpTime: 300 
          }));
          playSuccessSound();
          return false;
        } else if (obj.type === 'obstacle' && game.powerUp !== 'shield') {
          setGame(prevGame => {
            const newLives = prevGame.lives - 1;
            if (newLives <= 0) {
              setTimeout(endGame, 100);
            }
            return { ...prevGame, lives: newLives };
          });
          playGameSound('incorrect');
          return false;
        }
      }
      
      return obj.x > -50;
    }));
  };

  const updateGame = () => {
    if (gameState !== 'playing' || game.paused) return;

    // Update player physics
    setPlayer(prev => {
      let newPlayer = { ...prev };
      
      if (newPlayer.jumping) {
        newPlayer.jumpHeight += 8;
        if (newPlayer.jumpHeight >= 80) {
          newPlayer.jumping = false;
        }
      } else if (newPlayer.jumpHeight > 0) {
        newPlayer.jumpHeight -= 8;
        if (newPlayer.jumpHeight <= 0) {
          newPlayer.jumpHeight = 0;
        }
      }
      
      if (newPlayer.sliding) {
        setTimeout(() => {
          setPlayer(p => ({ ...p, sliding: false }));
        }, 500);
      }
      
      return newPlayer;
    });

    // Update game objects
    setGameObjects(prev => prev.map(obj => ({
      ...obj,
      x: obj.x - game.speed
    })).filter(obj => obj.x > -50));

    // Update game state
    setGame(prev => {
      let newGame = { ...prev };
      newGame.distance += 1;
      newGame.score += 1;
      
      if (newGame.distance % 500 === 0) {
        newGame.speed = Math.min(8, newGame.speed + 0.5);
        setCurrentEnvironment(c => (c + 1) % environments.length);
      }
      
      if (newGame.powerUpTime > 0) {
        newGame.powerUpTime -= 1;
        if (newGame.powerUpTime <= 0) {
          newGame.powerUp = 'none';
        }
      }
      
      return newGame;
    });

    // Spawn objects
    if (Math.random() < 0.02) {
      spawnObject();
    }

    checkCollisions();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const env = environments[currentEnvironment];
    
    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, env.colors[0]);
    gradient.addColorStop(0.5, env.colors[1]);
    gradient.addColorStop(1, env.colors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw lanes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    for (let i = 1; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(i * LANE_WIDTH, 0);
      ctx.lineTo(i * LANE_WIDTH, CANVAS_HEIGHT);
      ctx.stroke();
    }

    // Draw ground
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, GROUND_Y + 40, CANVAS_WIDTH, 40);

    // Draw game objects
    gameObjects.forEach(obj => {
      ctx.fillStyle = obj.color;
      
      if (obj.type === 'collectible') {
        ctx.beginPath();
        ctx.arc(obj.x + obj.width/2, obj.y + obj.height/2, obj.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Add symbol
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        const symbol = obj.subtype === 'calm-bubble' ? '💙' : 
                      obj.subtype === 'light-ray' ? '☀️' : '🧠';
        ctx.fillText(symbol, obj.x + obj.width/2, obj.y + obj.height/2 + 6);
      } else {
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
        
        // Add symbol
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        const symbol = obj.subtype === 'stress-cloud' ? '☁️' :
                      obj.subtype === 'racing-thoughts' ? '🌀' :
                      obj.subtype === 'digital-distraction' ? '📱' :
                      obj.subtype === 'breathe-mode' ? '🧘' :
                      obj.subtype === 'serenity-shield' ? '🛡️' : '🧲';
        ctx.fillText(symbol, obj.x + obj.width/2, obj.y + obj.height/2 + 5);
      }
    });

    // Draw player (Tranquilinho)
    const playerY = player.y - player.jumpHeight + (player.sliding ? 20 : 0);
    const playerHeight = PLAYER_SIZE - (player.sliding ? 20 : 0);
    
    // Player body
    ctx.fillStyle = game.powerUp === 'shield' ? '#ffd93d' : '#38B6FF';
    ctx.fillRect(player.x, playerY, PLAYER_SIZE, playerHeight);
    
    // Player face
    ctx.fillStyle = '#8B4513'; // Brown skin
    ctx.fillRect(player.x + 5, playerY + 5, 30, 20);
    
    // Curly hair
    ctx.fillStyle = '#4A4A4A';
    ctx.beginPath();
    ctx.arc(player.x + 20, playerY + 8, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x + 12, playerY + 12, 4, 4);
    ctx.fillRect(player.x + 24, playerY + 12, 4, 4);
    
    // Smile
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(player.x + 20, playerY + 15, 8, 0, Math.PI);
    ctx.stroke();

    // Power-up effects
    if (game.powerUp === 'breathe') {
      ctx.strokeStyle = '#a8e6cf';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(player.x + PLAYER_SIZE/2, playerY + playerHeight/2, 50, 0, Math.PI * 2);
      ctx.stroke();
    } else if (game.powerUp === 'magnet') {
      ctx.strokeStyle = '#ff9ff3';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.arc(player.x + PLAYER_SIZE/2, playerY + playerHeight/2, 60, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const gameLoop = () => {
    updateGame();
    draw();
    animationRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (gameState === 'playing' && !game.paused) {
      animationRef.current = requestAnimationFrame(gameLoop);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, game.paused]);

  const resetGame = () => {
    setGameState('menu');
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="glassmorphism">
            <CardHeader className="flex-row items-center space-y-0 pb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  🏃‍♂️ Tranquili Run+
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Corra pela Tranquilândia em uma aventura relaxante
                </p>
              </div>
            </CardHeader>
          </Card>

          <Card className="glassmorphism">
            <CardContent className="p-8 text-center space-y-6">
              <div className="text-8xl mb-4">🧘‍♂️</div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Tranquili Run+</h2>
                <p className="text-muted-foreground mb-6">
                  Embarque em uma jornada relaxante pela Tranquilândia. 
                  Colete bolhas de calma, evite pensamentos estressantes e mantenha sua serenidade!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <h3 className="font-semibold">🎮 Controles</h3>
                  <p>↑/W: Pular</p>
                  <p>↓/S: Deslizar</p>
                  <p>←→/AD: Trocar pista</p>
                  <p>Espaço: Pausar</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">💎 Coletáveis</h3>
                  <p>💙 Bolhas de Calma</p>
                  <p>☀️ Raios de Leveza</p>
                  <p>🧠 Símbolos de Foco</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold">⚡ Power-ups</h3>
                  <p>🧘 Modo Respira</p>
                  <p>🛡️ Escudo de Serenidade</p>
                  <p>🧲 Magnetismo Zen</p>
                </div>
              </div>

              {bestScore > 0 && (
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm">
                    🏆 Melhor Pontuação: <strong>{bestScore}</strong>
                  </p>
                </div>
              )}

              <Button onClick={startGame} size="lg" className="w-full md:w-auto">
                <Play className="h-4 w-4 mr-2" />
                Começar Jornada
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card className="glassmorphism max-w-lg w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div className="text-6xl mb-4">
              {game.score > bestScore ? '🏆' : '🧘‍♂️'}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {game.score > bestScore ? 'Novo Recorde de Tranquilidade!' : 'Jornada Finalizada!'}
              </h2>
              <p className="text-lg">
                Pontuação: <strong>{game.score}</strong>
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p>🎯 Distância: {game.distance}m</p>
                <p>💙 Bolhas: {game.calmBubbles}</p>
                <p>☀️ Raios: {game.lightRays}</p>
              </div>
              <div className="space-y-2">
                <p>🧠 Símbolos: {game.focusSymbols}</p>
                <p>🏆 Melhor: {bestScore}</p>
                <p>✨ XP: +{Math.floor(game.score / 10) + game.calmBubbles * 2 + game.lightRays * 3}</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={startGame} className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Jogar Novamente
              </Button>
              <Button onClick={resetGame} variant="outline" className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Menu
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full space-y-4">
        {/* HUD */}
        <div className="flex justify-between items-center glassmorphism p-4 rounded-lg">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              🎯 {game.score}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              📏 {game.distance}m
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Heart className="h-3 w-3 text-red-500" />
              {game.lives}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline">💙 {game.calmBubbles}</Badge>
            <Badge variant="outline">☀️ {game.lightRays}</Badge>
            <Badge variant="outline">🧠 {game.focusSymbols}</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            {game.powerUp !== 'none' && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {Math.ceil(game.powerUpTime / 60)}s
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={togglePause}
            >
              {gameState === 'paused' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Game Canvas */}
        <Card className="glassmorphism">
          <CardContent className="p-4">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="w-full max-w-full h-auto border rounded-lg"
                style={{ aspectRatio: `${CANVAS_WIDTH}/${CANVAS_HEIGHT}` }}
              />
              
              {gameState === 'paused' && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-center text-white">
                    <div className="text-4xl mb-4">⏸️</div>
                    <h3 className="text-xl font-bold mb-2">Jogo Pausado</h3>
                    <p className="text-sm mb-4">Respire fundo e relaxe</p>
                    <Button onClick={togglePause}>
                      <Play className="h-4 w-4 mr-2" />
                      Continuar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Environment Info */}
        <div className="text-center">
          <Badge variant="secondary" className="text-sm">
            🌍 {environments[currentEnvironment].name}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default TranquiliRunnerGame;

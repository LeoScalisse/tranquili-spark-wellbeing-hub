
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Settings, Home } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

interface GamePiece {
  shape: number[][];
  x: number;
  y: number;
  color: string;
  type: string;
}

interface GameStats {
  score: number;
  lines: number;
  level: number;
  timeElapsed: number;
}

interface TetrisTranquiloGameProps {
  onBack?: () => void;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 25;

const PIECES = {
  I: {
    shape: [[1, 1, 1, 1]],
    color: 'linear-gradient(45deg, #ffa07a, #ff6347)'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 'linear-gradient(45deg, #ffcccb, #ffc0cb)'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: 'linear-gradient(45deg, #e6e6fa, #dda0dd)'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: 'linear-gradient(45deg, #f8bbd9, #ff69b4)'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: 'linear-gradient(45deg, #f4c2c2, #deb887)'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: 'linear-gradient(45deg, #d4a5a5, #cd919e)'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: 'linear-gradient(45deg, #f7cac9, #e8b4b8)'
  }
};

const GAME_MODES = {
  calm: { name: '🌙 Modo Calmo', speed: 1500, color: 'from-pink-200 to-pink-300' },
  harmonic: { name: '🎵 Modo Harmônico', speed: 1000, color: 'from-pink-300 to-pink-400' },
  flow: { name: '✨ Modo Flow', speed: 800, color: 'from-pink-400 to-pink-500' }
};

const ZEN_MESSAGES = [
  "Respire fundo nos tons rosa da serenidade 🌸",
  "Cada peça encontra seu lugar na harmonia rosa 🌹",
  "Deixe o rosa acalmar sua mente estrelada 🌙",
  "Flua como pétalas rosa no vento suave 🍃",
  "Encontre paz nos movimentos rosa 🧘‍♀️"
];

const TetrisTranquiloGame: React.FC<TetrisTranquiloGameProps> = ({ onBack }) => {
  const [board, setBoard] = useState<(string | null)[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null))
  );
  const [currentPiece, setCurrentPiece] = useState<GamePiece | null>(null);
  const [nextPiece, setNextPiece] = useState<GamePiece | null>(null);
  const [gameMode, setGameMode] = useState<keyof typeof GAME_MODES>('harmonic');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState<GameStats>({ score: 0, lines: 0, level: 1, timeElapsed: 0 });
  const [zenMessage, setZenMessage] = useState(ZEN_MESSAGES[0]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [avatarBounce, setAvatarBounce] = useState(false);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const timeRef = useRef<NodeJS.Timeout | null>(null);
  const { playGameSound, playSuccessSound } = useAudio();

  const createPiece = useCallback((): GamePiece => {
    const types = Object.keys(PIECES) as Array<keyof typeof PIECES>;
    const type = types[Math.floor(Math.random() * types.length)];
    const piece = PIECES[type];
    
    return {
      shape: piece.shape,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2),
      y: 0,
      color: piece.color,
      type
    };
  }, []);

  const isValidPosition = useCallback((piece: GamePiece, deltaX = 0, deltaY = 0, newShape?: number[][]) => {
    const shape = newShape || piece.shape;
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const newX = piece.x + x + deltaX;
          const newY = piece.y + y + deltaY;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  }, [board]);

  const rotatePiece = useCallback((piece: GamePiece): number[][] => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return rotated;
  }, []);

  const placePiece = useCallback((piece: GamePiece) => {
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.color;
          }
        }
      }
    }
    
    setBoard(newBoard);
    return newBoard;
  }, [board]);

  const clearLines = useCallback((board: (string | null)[][]) => {
    let linesCleared = 0;
    const newBoard = board.filter(row => {
      const isComplete = row.every(cell => cell !== null);
      if (isComplete) linesCleared++;
      return !isComplete;
    });
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
    }
    
    if (linesCleared > 0) {
      setAvatarBounce(true);
      setTimeout(() => setAvatarBounce(false), 600);
      
      if (isSoundEnabled) {
        if (linesCleared === 4) {
          playSuccessSound();
        } else {
          playGameSound('correct');
        }
      }
      
      const points = linesCleared === 4 ? 1000 : linesCleared * 100;
      setStats(prev => ({
        ...prev,
        lines: prev.lines + linesCleared,
        score: prev.score + points * prev.level,
        level: Math.floor((prev.lines + linesCleared) / 10) + 1
      }));
      
      // Mensagem zen aleatória ao completar linhas
      setZenMessage(ZEN_MESSAGES[Math.floor(Math.random() * ZEN_MESSAGES.length)]);
    }
    
    return { board: newBoard, linesCleared };
  }, [isSoundEnabled, playGameSound, playSuccessSound]);

  const moveDown = useCallback(() => {
    if (!currentPiece || !isPlaying || isPaused) return;
    
    if (isValidPosition(currentPiece, 0, 1)) {
      setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
    } else {
      const newBoard = placePiece(currentPiece);
      const { board: clearedBoard } = clearLines(newBoard);
      setBoard(clearedBoard);
      
      const newPiece = nextPiece || createPiece();
      setCurrentPiece(newPiece);
      setNextPiece(createPiece());
      
      if (!isValidPosition(newPiece)) {
        setIsPlaying(false);
        if (isSoundEnabled) {
          playGameSound('incorrect');
        }
      }
    }
  }, [currentPiece, isPlaying, isPaused, isValidPosition, placePiece, clearLines, nextPiece, createPiece, isSoundEnabled, playGameSound]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!currentPiece || !isPlaying || isPaused) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        if (isValidPosition(currentPiece, -1, 0)) {
          setCurrentPiece(prev => prev ? { ...prev, x: prev.x - 1 } : null);
        }
        break;
      case 'ArrowRight':
        if (isValidPosition(currentPiece, 1, 0)) {
          setCurrentPiece(prev => prev ? { ...prev, x: prev.x + 1 } : null);
        }
        break;
      case 'ArrowDown':
        moveDown();
        break;
      case 'ArrowUp':
      case ' ':
        const rotatedShape = rotatePiece(currentPiece);
        if (isValidPosition(currentPiece, 0, 0, rotatedShape)) {
          setCurrentPiece(prev => prev ? { ...prev, shape: rotatedShape } : null);
          if (isSoundEnabled) {
            playGameSound('click');
          }
        }
        break;
    }
  }, [currentPiece, isPlaying, isPaused, isValidPosition, moveDown, rotatePiece, isSoundEnabled, playGameSound]);

  const startGame = useCallback(() => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)));
    setStats({ score: 0, lines: 0, level: 1, timeElapsed: 0 });
    const piece = createPiece();
    setCurrentPiece(piece);
    setNextPiece(createPiece());
    setIsPlaying(true);
    setIsPaused(false);
    setZenMessage(ZEN_MESSAGES[0]);
    
    if (isSoundEnabled) {
      playGameSound('click');
    }
  }, [createPiece, isSoundEnabled, playGameSound]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
    if (isSoundEnabled) {
      playGameSound('click');
    }
  }, [isSoundEnabled, playGameSound]);

  const resetGame = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentPiece(null);
    setNextPiece(null);
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)));
    setStats({ score: 0, lines: 0, level: 1, timeElapsed: 0 });
    
    if (isSoundEnabled) {
      playGameSound('click');
    }
  }, [isSoundEnabled, playGameSound]);

  // Game loop
  useEffect(() => {
    if (isPlaying && !isPaused) {
      const speed = Math.max(100, GAME_MODES[gameMode].speed - (stats.level - 1) * 50);
      gameLoopRef.current = setInterval(moveDown, speed);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, isPaused, moveDown, gameMode, stats.level]);

  // Timer
  useEffect(() => {
    if (isPlaying && !isPaused) {
      timeRef.current = setInterval(() => {
        setStats(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    } else {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    }
    
    return () => {
      if (timeRef.current) {
        clearInterval(timeRef.current);
      }
    };
  }, [isPlaying, isPaused]);

  // Keyboard events
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = currentPiece.color;
            }
          }
        }
      }
    }
    
    return displayBoard.map((row, y) => (
      <div key={y} className="flex">
        {row.map((cell, x) => (
          <div
            key={x}
            className="border border-pink-100/30"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              background: cell || 'rgba(255, 240, 245, 0.1)',
              borderRadius: cell ? '4px' : '0',
              boxShadow: cell ? 'inset 0 0 10px rgba(255,255,255,0.3)' : 'none'
            }}
          />
        ))}
      </div>
    ));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Floating clouds */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-10 bg-pink-50/20 rounded-full animate-float" />
        <div className="absolute top-32 right-20 w-16 h-8 bg-pink-50/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/4 w-24 h-12 bg-pink-50/20 rounded-full animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200 mb-6">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-between items-center mb-4">
                {onBack && (
                  <Button variant="outline" onClick={onBack} size="sm" className="border-pink-200">
                    <Home className="h-4 w-4 mr-2" />
                    Voltar
                  </Button>
                )}
                <div className="flex-1" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                  className="border-pink-200"
                >
                  {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </div>
              
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                🌸 Tetris Tranquilo
              </CardTitle>
              <p className="text-pink-600 mt-2">Uma experiência zen em tons rosa</p>
              
              {/* Game Mode Selector */}
              <div className="flex gap-2 justify-center mt-4">
                {Object.entries(GAME_MODES).map(([key, mode]) => (
                  <Button
                    key={key}
                    variant={gameMode === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setGameMode(key as keyof typeof GAME_MODES)}
                    className={`bg-gradient-to-r ${mode.color} border-pink-200`}
                    disabled={isPlaying}
                  >
                    {mode.name}
                  </Button>
                ))}
              </div>
            </CardHeader>
          </Card>

          {/* Game Area */}
          <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
            {/* Left Panel - Stats */}
            <div className="space-y-4">
              <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-pink-600">Pontuação</p>
                      <p className="text-2xl font-bold text-pink-800">{stats.score.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-pink-600">Linhas</p>
                      <p className="text-xl font-semibold text-pink-700">{stats.lines}</p>
                    </div>
                    <div>
                      <p className="text-sm text-pink-600">Nível</p>
                      <p className="text-xl font-semibold text-pink-700">{stats.level}</p>
                    </div>
                    <div>
                      <p className="text-sm text-pink-600">Tempo</p>
                      <p className="text-lg font-medium text-pink-700">{formatTime(stats.timeElapsed)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Next Piece */}
              {nextPiece && (
                <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-pink-600 mb-2">Próxima Peça</p>
                    <div className="flex justify-center">
                      <div className="grid gap-1">
                        {nextPiece.shape.map((row, y) => (
                          <div key={y} className="flex gap-1">
                            {row.map((cell, x) => (
                              <div
                                key={x}
                                className="border border-pink-100/30"
                                style={{
                                  width: 15,
                                  height: 15,
                                  background: cell ? nextPiece.color : 'transparent',
                                  borderRadius: cell ? '2px' : '0'
                                }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Game Board */}
            <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
              <CardContent className="p-4">
                <div 
                  className="border-2 border-pink-200 rounded-lg p-2"
                  style={{ 
                    background: 'linear-gradient(135deg, rgba(255,240,245,0.3), rgba(255,228,225,0.3))',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {renderBoard()}
                </div>
              </CardContent>
            </Card>

            {/* Right Panel - Controls and Zen */}
            <div className="space-y-4">
              {/* Controls */}
              <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={isPlaying ? togglePause : startGame}
                      className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600"
                    >
                      {isPlaying ? (isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />) : '🌸 Iniciar'}
                    </Button>
                    
                    <Button
                      onClick={resetGame}
                      variant="outline"
                      className="border-pink-200"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-xs text-pink-600">
                      Use as setas para mover e girar
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Zen Avatar */}
              <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
                <CardContent className="p-4 text-center">
                  <div className={`text-4xl mb-2 ${avatarBounce ? 'animate-bounce' : ''}`}>
                    🧘‍♀️
                  </div>
                  <p className="text-sm text-pink-600">
                    {zenMessage}
                  </p>
                </CardContent>
              </Card>

              {/* Game Status */}
              {(isPaused || !isPlaying) && (
                <Card className="bg-gradient-to-r from-pink-200 to-purple-200 border-pink-300">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-pink-800">
                      {isPaused ? '⏸️ Jogo pausado - respire fundo' : 
                       !isPlaying && stats.score > 0 ? `🌸 Fim de jogo - ${stats.score} pontos` : 
                       '🌸 Pronto para uma jornada zen?'}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Instructions */}
          <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200 mt-6">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-pink-700">
                💡 <strong>Dica:</strong> Use as setas do teclado para mover e girar as peças. 
                Encontre sua paz interior enquanto cria harmonia rosa! 🌸
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TetrisTranquiloGame;

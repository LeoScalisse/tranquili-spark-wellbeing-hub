import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pause, RotateCcw, Volume2 } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { useUser } from '@/contexts/UserContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface TetrisTranquiloGameProps {
  onBack: () => void;
}

interface Piece {
  shape: number[][];
  color: string;
}

interface Position {
  x: number;
  y: number;
}

interface GameMode {
  id: string;
  name: string;
  description: string;
  speed: number;
  icon: React.ReactNode;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const PIECES: Piece[] = [
  { shape: [[1, 1, 1, 1]], color: 'bg-cyan-500' },    // I
  { shape: [[1, 1], [1, 1]], color: 'bg-yellow-500' },  // O
  { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' },   // S
  { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500' },     // Z
  { shape: [[1, 0, 0], [1, 1, 1]], color: 'bg-orange-500' },  // L
  { shape: [[0, 0, 1], [1, 1, 1]], color: 'bg-blue-500' },   // J
  { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500' }   // T
];

const GAME_MODES: GameMode[] = [
  {
    id: 'calm',
    name: 'Modo Calmo',
    description: 'Velocidade suave para relaxamento total',
    speed: 800,
    icon: '🌙'
  },
  {
    id: 'harmonic',
    name: 'Modo Harmônico',
    description: 'Equilíbrio entre calma e desafio',
    speed: 500,
    icon: '🎵'
  },
  {
    id: 'flow',
    name: 'Modo Flow',
    description: 'Para entrar em estado de flow profundo',
    speed: 300,
    icon: '✨'
  }
];

const TetrisTranquiloGame: React.FC<TetrisTranquiloGameProps> = ({ onBack }) => {
  const { playGameSound, startGameAmbient, stopGameAmbient } = useAudio();
  const { user, addXP, updateGameProgress } = useUser();
  const isMobile = useIsMobile();
  const gameRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const [board, setBoard] = useState<number[][]>(() =>
    Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece>(PIECES[0]);
  const [piecePosition, setPiecePosition] = useState<Position>({ x: 4, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentMode, setCurrentMode] = useState<GameMode>(GAME_MODES[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startGameAmbient('memory');
    return () => {
      stopGameAmbient();
    };
  }, [startGameAmbient, stopGameAmbient]);

  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const blockSize = isMobile ? 25 : 30;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o tabuleiro
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y][x] !== 0) {
          const piece = PIECES.find(p => p.color === board[y][x]);
          ctx.fillStyle = piece?.color || 'white';
          ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        }
      }
    }

    // Desenha a peça atual
    currentPiece.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          ctx.fillStyle = currentPiece.color;
          ctx.fillRect((piecePosition.x + colIndex) * blockSize, (piecePosition.y + rowIndex) * blockSize, blockSize, blockSize);
        }
      });
    });
  }, [board, currentPiece, piecePosition, isMobile]);

  useEffect(() => {
    drawBoard();
  }, [drawBoard]);

  const resetGame = useCallback(() => {
    setBoard(() =>
      Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))
    );
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setGameStarted(false);
    setIsPaused(false);
    setPiecePosition({ x: 4, y: 0 });
    setCurrentPiece(PIECES[Math.floor(Math.random() * PIECES.length)]);
    playGameSound('click');
  }, [playGameSound]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    setLines(0);
    setLevel(1);
    setBoard(() =>
      Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))
    );
    setPiecePosition({ x: 4, y: 0 });
    setCurrentPiece(PIECES[Math.floor(Math.random() * PIECES.length)]);
    playGameSound('click');
  }, [playGameSound]);

  const togglePause = () => {
    setIsPaused(!isPaused);
    playGameSound('click');
  };

  const checkCollision = useCallback((piece: Piece, position: Position, boardState: number[][]) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const boardX = position.x + x;
          const boardY = position.y + y;

          if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
            return true;
          }
          if (boardY < 0) {
            continue;
          }
          if (boardState[boardY][boardX] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const movePieceDown = useCallback(() => {
    if (isPaused || gameOver || !gameStarted) return;

    const newPosition = { ...piecePosition, y: piecePosition.y + 1 };
    if (!checkCollision(currentPiece, newPosition, board)) {
      setPiecePosition(newPosition);
    } else {
      let newBoard = board.map(row => [...row]);
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            newBoard[piecePosition.y + y][piecePosition.x + x] = currentPiece.color;
          }
        }
      }

      const clearedLines = [];
      newBoard.forEach((row, y) => {
        if (row.every(cell => cell !== 0)) {
          clearedLines.push(y);
        }
      });

      if (clearedLines.length > 0) {
        clearedLines.forEach(line => {
          newBoard.splice(line, 1);
          newBoard.unshift(Array(BOARD_WIDTH).fill(0));
        });

        setScore(prevScore => prevScore + clearedLines.length * 100 * level);
        setLines(prevLines => prevLines + clearedLines.length);
        setLevel(prevLevel => prevLevel + Math.floor((prevLines + clearedLines.length) / 10));
      }

      setBoard(newBoard);

      const newPiece = PIECES[Math.floor(Math.random() * PIECES.length)];
      setCurrentPiece(newPiece);
      setPiecePosition({ x: 4, y: 0 });

      if (checkCollision(newPiece, { x: 4, y: 0 }, newBoard)) {
        setGameOver(true);
        setGameStarted(false);

        if (user) {
          updateGameProgress('tetrisTranquilo', {
            currentLevel: level,
            highestLevel: Math.max(level, user.gameProgress?.tetrisTranquilo?.highestLevel || 0),
            totalMatches: (user.gameProgress?.tetrisTranquilo?.totalMatches || 0) + lines,
            timePlayedToday: (user.gameProgress?.tetrisTranquilo?.timePlayedToday || 0) + 1,
            lastPlayDate: new Date().toISOString().split('T')[0]
          });
        }
        addXP(Math.floor(score / 10));
        playGameSound('error');
      } else {
        playGameSound('card');
      }
    }
  }, [isPaused, gameOver, currentPiece, piecePosition, checkCollision, board, level, playGameSound, addXP, user, updateGameProgress, gameStarted]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (gameStarted && !isPaused && !gameOver) {
      intervalId = setInterval(movePieceDown, currentMode.speed);
    }

    return () => clearInterval(intervalId);
  }, [movePieceDown, currentMode.speed, gameStarted, isPaused, gameOver]);

  const rotatePiece = useCallback((piece: Piece) => {
    const rotatedShape: number[][] = piece.shape[0].map((val, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return { ...piece, shape: rotatedShape };
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (isPaused || gameOver || !gameStarted) return;

    let newPosition = { ...piecePosition };
    let newPiece = currentPiece;

    switch (event.key) {
      case 'ArrowLeft':
        newPosition = { ...piecePosition, x: piecePosition.x - 1 };
        break;
      case 'ArrowRight':
        newPosition = { ...piecePosition, x: piecePosition.x + 1 };
        break;
      case 'ArrowDown':
        movePieceDown();
        return;
      case ' ':
      case 'ArrowUp':
        newPiece = rotatePiece(currentPiece);
        break;
      default:
        return;
    }

    if (!checkCollision(newPiece, newPosition, board)) {
      setCurrentPiece(newPiece);
      setPiecePosition(newPosition);
    }
  }, [isPaused, gameOver, currentPiece, piecePosition, board, movePieceDown, rotatePiece, gameStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Touch controls para mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, [isMobile]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isMobile || !touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const threshold = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Movimento horizontal
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          handleKeyPress({ key: 'ArrowRight' } as KeyboardEvent);
        } else {
          handleKeyPress({ key: 'ArrowLeft' } as KeyboardEvent);
        }
      }
    } else {
      // Movimento vertical
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          handleKeyPress({ key: 'ArrowDown' } as KeyboardEvent);
        } else {
          handleKeyPress({ key: 'ArrowUp' } as KeyboardEvent);
        }
      }
    }

    touchStartRef.current = null;
  }, [isMobile, handleKeyPress]);

  const handleTap = useCallback((e: React.TouchEvent) => {
    if (!isMobile) return;
    
    // Tap para girar peça
    if (e.touches.length === 1) {
      handleKeyPress({ key: ' ' } as KeyboardEvent);
    }
  }, [isMobile, handleKeyPress]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-10 bg-pink-50/20 rounded-full animate-float" />
        <div className="absolute top-32 right-20 w-16 h-8 bg-pink-50/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/4 w-24 h-12 bg-pink-50/20 rounded-full animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 p-4">
        <div className={`mx-auto space-y-4 ${isMobile ? 'max-w-sm' : 'max-w-4xl'}`}>
          {/* Header otimizado para mobile */}
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200">
            <CardHeader className={isMobile ? 'p-4 pb-2' : undefined}>
              <div className={`flex items-center ${isMobile ? 'flex-col space-y-2' : 'justify-between mb-4'}`}>
                <div className={`flex items-center ${isMobile ? 'w-full justify-between' : ''}`}>
                  <Button 
                    variant="outline" 
                    onClick={onBack} 
                    size="sm" 
                    className={`border-pink-200 ${isMobile ? 'min-h-[44px]' : ''}`}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {isMobile ? 'Voltar' : 'Voltar'}
                  </Button>

                  {!isMobile && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={togglePause}
                        size="sm"
                        className="border-pink-200"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        {isPaused ? 'Continuar' : 'Pausar'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={resetGame}
                        size="sm"
                        className="border-pink-200"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reiniciar
                      </Button>
                    </div>
                  )}
                </div>

                {isMobile && (
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="outline"
                      onClick={togglePause}
                      size="sm"
                      className="border-pink-200 flex-1 min-h-[44px]"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      {isPaused ? 'Continuar' : 'Pausar'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={resetGame}
                      size="sm"
                      className="border-pink-200 flex-1 min-h-[44px]"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reiniciar
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <CardTitle className={`bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent ${
                  isMobile ? 'text-3xl' : 'text-5xl'
                } font-bold mb-4`}>
                  🌸 Tetris Tranquilo
                </CardTitle>
                <p className={`text-pink-600 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  Uma jornada zen através dos tons rosa da serenidade
                </p>
              </div>
            </CardHeader>
          </Card>

          {/* Game container com layout responsivo */}
          <div className={`${isMobile ? 'space-y-4' : 'grid md:grid-cols-2 gap-8'}`}>
            {/* Game board */}
            <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
              <CardContent className={isMobile ? 'p-4' : 'p-6'}>
                <div className="text-center mb-4">
                  <h3 className={`font-bold text-pink-800 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                    🎮 Jogo
                  </h3>
                </div>
                
                <div 
                  ref={gameRef}
                  className={`mx-auto bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg p-4 ${
                    isMobile ? 'w-full max-w-[280px]' : 'w-fit'
                  }`}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={(e) => e.preventDefault()}
                  style={{ touchAction: 'none' }}
                >
                  <canvas
                    ref={canvasRef}
                    width={isMobile ? 250 : 300}
                    height={isMobile ? 400 : 500}
                    className="border-2 border-pink-300 rounded bg-white/80"
                  />
                </div>

                {/* Controles touch para mobile */}
                {isMobile && (
                  <div className="mt-4 text-center">
                    <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
                      <div></div>
                      <Button
                        onTouchStart={() => handleKeyPress({ key: 'ArrowUp' } as KeyboardEvent)}
                        className="bg-pink-200 hover:bg-pink-300 text-pink-800 min-h-[44px]"
                        variant="outline"
                      >
                        ⬆️
                      </Button>
                      <div></div>
                      
                      <Button
                        onTouchStart={() => handleKeyPress({ key: 'ArrowLeft' } as KeyboardEvent)}
                        className="bg-pink-200 hover:bg-pink-300 text-pink-800 min-h-[44px]"
                        variant="outline"
                      >
                        ⬅️
                      </Button>
                      <Button
                        onTouchStart={() => handleKeyPress({ key: 'ArrowDown' } as KeyboardEvent)}
                        className="bg-pink-200 hover:bg-pink-300 text-pink-800 min-h-[44px]"
                        variant="outline"
                      >
                        ⬇️
                      </Button>
                      <Button
                        onTouchStart={() => handleKeyPress({ key: 'ArrowRight' } as KeyboardEvent)}
                        className="bg-pink-200 hover:bg-pink-300 text-pink-800 min-h-[44px]"
                        variant="outline"
                      >
                        ➡️
                      </Button>
                    </div>
                    
                    <Button
                      onTouchStart={() => handleKeyPress({ key: ' ' } as KeyboardEvent)}
                      className="bg-pink-300 hover:bg-pink-400 text-pink-800 min-h-[44px] w-full mt-2"
                      variant="outline"
                    >
                      🔄 Girar
                    </Button>
                    
                    <p className="text-xs text-pink-600 mt-2">
                      💡 Deslize na tela do jogo para controlar as peças
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats e controles */}
            <div className="space-y-4">
              {/* Score */}
              <Card className="bg-gradient-to-r from-pink-100 to-purple-100 border-pink-200">
                <CardContent className={isMobile ? 'p-4' : 'p-6'}>
                  <h4 className={`font-semibold text-pink-800 mb-3 ${isMobile ? 'text-center' : ''}`}>
                    📊 Estatísticas
                  </h4>
                  <div className={`${isMobile ? 'grid grid-cols-2 gap-4' : 'space-y-3'}`}>
                    <div className={`${isMobile ? 'text-center' : ''}`}>
                      <p className="text-sm text-pink-700">Pontuação</p>
                      <p className={`font-bold text-pink-800 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                        {score.toLocaleString()}
                      </p>
                    </div>
                    <div className={`${isMobile ? 'text-center' : ''}`}>
                      <p className="text-sm text-pink-700">Linhas</p>
                      <p className={`font-bold text-pink-800 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                        {lines}
                      </p>
                    </div>
                    <div className={`${isMobile ? 'text-center' : ''}`}>
                      <p className="text-sm text-pink-700">Nível</p>
                      <p className={`font-bold text-pink-800 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                        {level}
                      </p>
                    </div>
                    <div className={`${isMobile ? 'text-center' : ''}`}>
                      <p className="text-sm text-pink-700">Modo</p>
                      <p className={`font-medium text-pink-800 ${isMobile ? 'text-sm' : 'text-base'}`}>
                        {currentMode.name}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mode selector compacto para mobile */}
              {!gameStarted && (
                <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
                  <CardContent className={isMobile ? 'p-4' : 'p-6'}>
                    <h4 className={`font-semibold text-pink-800 mb-3 ${isMobile ? 'text-center' : ''}`}>
                      🌸 Modos de Jogo
                    </h4>
                    <div className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}>
                      {GAME_MODES.map((mode) => (
                        <Button
                          key={mode.id}
                          onClick={() => setCurrentMode(mode)}
                          variant={currentMode.id === mode.id ? "default" : "outline"}
                          className={`w-full justify-start text-left ${
                            isMobile ? 'min-h-[44px] text-sm' : ''
                          } ${
                            currentMode.id === mode.id 
                              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                              : 'border-pink-200 hover:bg-pink-50'
                          }`}
                        >
                          <span className="mr-2">{mode.icon}</span>
                          <div>
                            <div className="font-medium">{mode.name}</div>
                            <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                              {mode.description}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Start/Reset button */}
          <div className="text-center">
            <Button
              onClick={gameStarted ? resetGame : startGame}
              size="lg"
              className={`bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 ${
                isMobile ? 'w-full min-h-[50px] text-lg' : 'text-lg'
              }`}
              disabled={isPaused}
            >
              {gameStarted ? '🔄 Reiniciar Jogo' : '🌸 Começar Jornada Zen'}
            </Button>
          </div>

          {/* Pause overlay */}
          {isPaused && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="bg-white/90 backdrop-blur-sm border-pink-200">
                <CardContent className={`text-center ${isMobile ? 'p-6' : 'p-8'}`}>
                  <div className={`${isMobile ? 'text-4xl' : 'text-6xl'} mb-4`}>⏸️</div>
                  <h3 className={`font-bold text-pink-800 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                    Jogo Pausado
                  </h3>
                  <p className={`text-pink-600 mb-4 ${isMobile ? 'text-sm' : ''}`}>
                    Respire fundo e encontre sua paz interior
                  </p>
                  <Button
                    onClick={togglePause}
                    className={`bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white ${
                      isMobile ? 'w-full min-h-[44px]' : ''
                    }`}
                  >
                    Continuar Jornada
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Game Over overlay */}
          {gameOver && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="bg-white/90 backdrop-blur-sm border-pink-200">
                <CardContent className={`text-center ${isMobile ? 'p-6' : 'p-8'}`}>
                  <div className={`${isMobile ? 'text-4xl' : 'text-6xl'} mb-4`}>🌸</div>
                  <h3 className={`font-bold text-pink-800 mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                    Jornada Zen Completa
                  </h3>
                  <p className={`text-pink-600 mb-4 ${isMobile ? 'text-sm' : ''}`}>
                    Você alcançou {lines} linhas e {score.toLocaleString()} pontos
                  </p>
                  <div className="space-y-2 mb-4">
                    <Badge className="bg-pink-100 text-pink-800">
                      💎 Nível {level}
                    </Badge>
                    <Badge className="bg-purple-100 text-purple-800">
                      ✨ +{Math.floor(score / 10)} XP
                    </Badge>
                  </div>
                  <Button
                    onClick={resetGame}
                    className={`bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white ${
                      isMobile ? 'w-full min-h-[44px]' : ''
                    }`}
                  >
                    🌸 Nova Jornada
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TetrisTranquiloGame;

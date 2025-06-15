
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { useRunnerGame } from '@/hooks/useRunnerGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, Square } from 'lucide-react';

interface TranquiliRun3DProps {
  onBack: () => void;
}

// Componente do personagem Tranquilinho em 3D
const Tranquilinho = ({ position, isJumping, isInZenMode, hasShield }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Animação de corrida suave
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 8) * 0.1;
      
      // Animação de respiração zen
      if (isInZenMode) {
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.05);
      }
    }
  });

  return (
    <group position={position}>
      {/* Corpo do Tranquilinho */}
      <mesh ref={meshRef} position={[0, 0.5, 0]}>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshStandardMaterial color="#38B6FF" />
      </mesh>
      
      {/* Cabeça */}
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[0.4]} />
        <meshStandardMaterial color="#D2B48C" />
      </mesh>
      
      {/* Cabelo cacheado */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[0.35]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
      
      {/* Braços */}
      <mesh position={[-0.5, 0.8, 0]} rotation={[0, 0, Math.PI * 0.1]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#38B6FF" />
      </mesh>
      <mesh position={[0.5, 0.8, 0]} rotation={[0, 0, -Math.PI * 0.1]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#38B6FF" />
      </mesh>
      
      {/* Pernas */}
      <mesh position={[-0.2, -0.4, 0]}>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <meshStandardMaterial color="#FFDE59" />
      </mesh>
      <mesh position={[0.2, -0.4, 0]}>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <meshStandardMaterial color="#FFDE59" />
      </mesh>
      
      {/* Escudo zen */}
      {hasShield && (
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[1.2]} />
          <meshStandardMaterial 
            color="gold" 
            transparent 
            opacity={0.3}
            emissive="gold"
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
      
      {/* Aura zen */}
      {isInZenMode && (
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[1.5]} />
          <meshStandardMaterial 
            color="purple" 
            transparent 
            opacity={0.1}
            emissive="purple"
            emissiveIntensity={0.1}
          />
        </mesh>
      )}
    </group>
  );
};

// Componente do cenário 3D
const GameEnvironment = ({ scenery }: { scenery: string }) => {
  const groundRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (groundRef.current) {
      groundRef.current.position.z += 0.1;
      if (groundRef.current.position.z > 10) {
        groundRef.current.position.z = -50;
      }
    }
  });

  const getSceneryColor = () => {
    switch (scenery) {
      case 'garden': return '#90EE90';
      case 'forest': return '#228B22';
      case 'sky': return '#87CEEB';
      default: return '#90EE90';
    }
  };

  return (
    <>
      {/* Chão infinito */}
      <mesh ref={groundRef} position={[0, -1, -20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 100]} />
        <meshStandardMaterial color={getSceneryColor()} />
      </mesh>
      
      {/* Pistas demarcadas */}
      <mesh position={[-2, -0.99, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 100]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>
      <mesh position={[2, -0.99, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, 100]} />
        <meshStandardMaterial color="white" transparent opacity={0.8} />
      </mesh>
      
      {/* Elementos decorativos do cenário */}
      {scenery === 'garden' && (
        <>
          {/* Flores */}
          {Array.from({ length: 10 }).map((_, i) => (
            <mesh key={i} position={[Math.random() * 20 - 10, 0, -i * 10]}>
              <sphereGeometry args={[0.3]} />
              <meshStandardMaterial color="#FFB6C1" />
            </mesh>
          ))}
        </>
      )}
      
      {scenery === 'forest' && (
        <>
          {/* Árvores */}
          {Array.from({ length: 8 }).map((_, i) => (
            <group key={i} position={[8 - Math.random() * 16, 0, -i * 12]}>
              <mesh position={[0, 1, 0]}>
                <cylinderGeometry args={[0.3, 0.3, 2]} />
                <meshStandardMaterial color="#8B4513" />
              </mesh>
              <mesh position={[0, 2.5, 0]}>
                <sphereGeometry args={[1]} />
                <meshStandardMaterial color="#228B22" />
              </mesh>
            </group>
          ))}
        </>
      )}
      
      {scenery === 'sky' && (
        <>
          {/* Nuvens */}
          {Array.from({ length: 12 }).map((_, i) => (
            <mesh key={i} position={[Math.random() * 20 - 10, 3 + Math.random() * 2, -i * 8]}>
              <sphereGeometry args={[1 + Math.random()]} />
              <meshStandardMaterial color="white" transparent opacity={0.8} />
            </mesh>
          ))}
        </>
      )}
    </>
  );
};

// Componente dos coletáveis 3D
const Collectible3D = ({ collectible }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && !collectible.collected) {
      meshRef.current.rotation.y += 0.05;
      meshRef.current.position.y = collectible.y / 100 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
      meshRef.current.position.z += 0.1;
    }
  });

  if (collectible.collected) return null;

  const getCollectibleColor = () => {
    switch (collectible.type) {
      case 'calm': return '#38B6FF';
      case 'light': return '#FFDE59';
      case 'focus': return '#9932CC';
      default: return '#38B6FF';
    }
  };

  return (
    <mesh 
      ref={meshRef} 
      position={[(collectible.x - 200) / 50, 1, -collectible.y / 100]}
    >
      <sphereGeometry args={[0.3]} />
      <meshStandardMaterial 
        color={getCollectibleColor()} 
        emissive={getCollectibleColor()}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
};

// Componente dos obstáculos 3D
const Obstacle3D = ({ obstacle }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.z += 0.1;
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={[(obstacle.x - 200) / 50, 0.5, -obstacle.y / 100]}
    >
      <boxGeometry args={[0.8, 1, 0.8]} />
      <meshStandardMaterial color="#696969" />
    </mesh>
  );
};

// Câmera customizada que segue o jogador
const GameCamera = ({ playerLane }: { playerLane: number }) => {
  const { camera } = useThree();
  
  useFrame(() => {
    // Posição da câmera atrás do jogador
    const targetX = (playerLane - 1) * 2;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.1);
    camera.position.y = 3;
    camera.position.z = 8;
    
    // Olhar para o jogador
    camera.lookAt(targetX, 1, 0);
  });
  
  return null;
};

// Componente principal da cena 3D
const Game3DScene = ({ gameState, movePlayer }: any) => {
  return (
    <>
      {/* Iluminação */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#FFDE59" />
      
      {/* Câmera personalizada */}
      <GameCamera playerLane={gameState.player.lane} />
      
      {/* Cenário */}
      <GameEnvironment scenery={gameState.stats.currentScenery} />
      
      {/* Personagem */}
      <Tranquilinho 
        position={[(gameState.player.lane - 1) * 2, gameState.player.isJumping ? 2 : 0, 0]}
        isJumping={gameState.player.isJumping}
        isInZenMode={gameState.player.isInZenMode}
        hasShield={gameState.player.hasShield}
      />
      
      {/* Coletáveis */}
      {gameState.collectibles.map((collectible: any) => (
        <Collectible3D key={collectible.id} collectible={collectible} />
      ))}
      
      {/* Obstáculos */}
      {gameState.obstacles.map((obstacle: any) => (
        <Obstacle3D key={obstacle.id} obstacle={obstacle} />
      ))}
    </>
  );
};

const TranquiliRun3D: React.FC<TranquiliRun3DProps> = ({ onBack }) => {
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
                <CardTitle className="text-2xl text-accent">🏃‍♂️ Tranquili Run+ 3D</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Um runner infinito 3D relaxante com Tranquilinho
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-6xl animate-bounce">🧑‍🦱</div>
                <h2 className="text-xl font-semibold">Bem-vindo à Tranquilândia 3D!</h2>
                <p className="text-muted-foreground">
                  Corra por paisagens 3D relaxantes, coletando bolhas de calma 
                  e evitando o estresse em uma experiência imersiva.
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
                  <Badge variant="outline">Mouse: Rotacionar câmera</Badge>
                </div>
              </div>

              <Button onClick={startGame} className="w-full text-lg py-6">
                <Play className="mr-2 h-5 w-5" />
                Começar Aventura 3D Zen
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto space-y-4">
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

        {/* Canvas 3D */}
        <Card className="glassmorphism overflow-hidden">
          <div style={{ height: '500px', width: '100%' }}>
            <Canvas>
              <Game3DScene gameState={gameState} movePlayer={movePlayer} />
            </Canvas>
          </div>
          
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
        </Card>

        {/* Game Over */}
        {!gameState.isPlaying && gameState.stats.score > 0 && (
          <Card className="glassmorphism">
            <CardContent className="p-6 text-center space-y-4">
              <h2 className="text-2xl font-semibold">Sessão 3D de Tranquilidade Concluída! 🌟</h2>
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

export default TranquiliRun3D;

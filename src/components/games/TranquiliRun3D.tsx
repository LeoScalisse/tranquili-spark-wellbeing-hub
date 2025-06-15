
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRunnerGame } from '@/hooks/useRunnerGame';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, Square, Volume2, Leaf } from 'lucide-react';

interface TranquiliRun3DProps {
  onBack: () => void;
}

// Personagem Tranquilinho estilo Pixar/Kidcore
const Tranquilinho = ({ position, isJumping, isInZenMode, hasShield }: any) => {
  const meshRef = useRef<THREE.Group>(null);
  const breathingRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Animação de corrida suave com bounce natural
      const time = state.clock.elapsedTime;
      meshRef.current.rotation.z = Math.sin(time * 6) * 0.05;
      meshRef.current.position.y = position[1] + Math.sin(time * 8) * 0.02;
      
      // Respiração visível zen
      if (breathingRef.current && isInZenMode) {
        breathingRef.current.scale.setScalar(1 + Math.sin(time * 1.5) * 0.08);
      }
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Corpo principal - proporções kidcore */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.8, 8]} />
        <meshStandardMaterial color="#38B6FF" />
      </mesh>
      
      {/* Cabeça maior estilo Pixar */}
      <mesh ref={breathingRef} position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#D2B48C" />
      </mesh>
      
      {/* Cabelos cacheados volumosos */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.45, 8, 8]} />
        <meshStandardMaterial color="#2C1810" />
      </mesh>
      
      {/* Detalhes dos cabelos - cachos individuais */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI * 2) / 8) * 0.3,
            1.4 + Math.sin((i * Math.PI * 2) / 8) * 0.1,
            Math.sin((i * Math.PI * 2) / 8) * 0.3
          ]}
        >
          <sphereGeometry args={[0.15, 6, 6]} />
          <meshStandardMaterial color="#3D2317" />
        </mesh>
      ))}
      
      {/* Braços arredondados */}
      <mesh position={[-0.6, 0.5, 0]} rotation={[0, 0, Math.PI * 0.2]}>
        <capsuleGeometry args={[0.15, 0.6]} />
        <meshStandardMaterial color="#38B6FF" />
      </mesh>
      <mesh position={[0.6, 0.5, 0]} rotation={[0, 0, -Math.PI * 0.2]}>
        <capsuleGeometry args={[0.15, 0.6]} />
        <meshStandardMaterial color="#38B6FF" />
      </mesh>
      
      {/* Pernas - calça azul */}
      <mesh position={[-0.2, -0.3, 0]}>
        <capsuleGeometry args={[0.18, 0.7]} />
        <meshStandardMaterial color="#1E40AF" />
      </mesh>
      <mesh position={[0.2, -0.3, 0]}>
        <capsuleGeometry args={[0.18, 0.7]} />
        <meshStandardMaterial color="#1E40AF" />
      </mesh>
      
      {/* Tênis brancos com detalhes amarelos */}
      <mesh position={[-0.2, -0.8, 0.1]}>
        <boxGeometry args={[0.3, 0.2, 0.4]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.2, -0.8, 0.1]}>
        <boxGeometry args={[0.3, 0.2, 0.4]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Detalhes amarelos dos tênis */}
      <mesh position={[-0.2, -0.75, 0.2]}>
        <boxGeometry args={[0.15, 0.05, 0.1]} />
        <meshStandardMaterial color="#FFDE59" />
      </mesh>
      <mesh position={[0.2, -0.75, 0.2]}>
        <boxGeometry args={[0.15, 0.05, 0.1]} />
        <meshStandardMaterial color="#FFDE59" />
      </mesh>
      
      {/* Escudo zen translúcido */}
      {hasShield && (
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[1.4, 16, 16]} />
          <meshStandardMaterial 
            color="#FFDE59" 
            transparent 
            opacity={0.2}
            emissive="#FFDE59"
            emissiveIntensity={0.3}
          />
        </mesh>
      )}
      
      {/* Aura zen roxa */}
      {isInZenMode && (
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[1.8, 12, 12]} />
          <meshStandardMaterial 
            color="#B9B5F6" 
            transparent 
            opacity={0.15}
            emissive="#B9B5F6"
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
      
      {/* Rastro azul suave */}
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[0.8, 3]} />
        <meshStandardMaterial 
          color="#38B6FF"
          transparent
          opacity={0.3}
          emissive="#38B6FF"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
};

// Plataformas flutuantes orgânicas
const FloatingPlatform = ({ position, type = 'stone' }: any) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
      meshRef.current.rotation.y += 0.002;
    }
  });

  const getGeometry = () => {
    switch (type) {
      case 'leaf':
        return <sphereGeometry args={[1.2, 8, 6]} />;
      case 'cushion':
        return <cylinderGeometry args={[1, 1, 0.3, 8]} />;
      default:
        return <sphereGeometry args={[1, 12, 8]} />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'leaf':
        return '#A8D5BA';
      case 'cushion':
        return '#FFD6E8';
      default:
        return '#E5E7EB';
    }
  };

  return (
    <mesh ref={meshRef} position={position}>
      {getGeometry()}
      <meshStandardMaterial 
        color={getColor()} 
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
};

// Coletáveis estilizados 3D
const StylizedCollectible = ({ collectible }: any) => {
  const meshRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (meshRef.current && !collectible.collected) {
      meshRef.current.rotation.y += 0.03;
      meshRef.current.position.y = collectible.y / 100 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
      meshRef.current.position.z += 0.1;
      
      // Animação das partículas
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.01;
      }
    }
  });

  if (collectible.collected) return null;

  const renderCollectible = () => {
    switch (collectible.type) {
      case 'calm':
        return (
          <group>
            {/* Bolha translúcida */}
            <mesh>
              <sphereGeometry args={[0.4, 16, 16]} />
              <meshStandardMaterial 
                color="#38B6FF"
                transparent
                opacity={0.6}
                emissive="#38B6FF"
                emissiveIntensity={0.3}
              />
            </mesh>
            {/* Partículas internas */}
            <points ref={particlesRef}>
              <bufferGeometry>
                <bufferAttribute
                  array={new Float32Array(Array.from({ length: 30 }, () => 
                    [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]).flat())}
                  count={10}
                  itemSize={3}
                />
              </bufferGeometry>
              <pointsMaterial color="#FFFFFF" size={0.02} />
            </points>
          </group>
        );
      
      case 'light':
        return (
          <mesh>
            <octahedronGeometry args={[0.4, 2]} />
            <meshStandardMaterial 
              color="#FFDE59"
              transparent
              opacity={0.8}
              emissive="#FFDE59"
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      
      case 'focus':
        return (
          <mesh>
            <dodecahedronGeometry args={[0.35]} />
            <meshStandardMaterial 
              color="#B9B5F6"
              metalness={0.8}
              roughness={0.2}
              emissive="#B9B5F6"
              emissiveIntensity={0.4}
            />
          </mesh>
        );
      
      default:
        return null;
    }
  };

  return (
    <group 
      ref={meshRef} 
      position={[(collectible.x - 200) / 50, 2, -collectible.y / 100]}
    >
      {renderCollectible()}
    </group>
  );
};

// Obstáculos suaves estilizados
const StylizedObstacle = ({ obstacle }: any) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.z += 0.1;
      meshRef.current.rotation.y += 0.01;
      
      // Animação de vibração para telas de distração
      if (obstacle.type === 'distraction') {
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 10) * 0.1;
      }
    }
  });

  const renderObstacle = () => {
    switch (obstacle.type) {
      case 'stress':
        return (
          <mesh>
            <sphereGeometry args={[0.8, 8, 8]} />
            <meshStandardMaterial 
              color="#4B5563"
              transparent
              opacity={0.7}
            />
          </mesh>
        );
      
      case 'distraction':
        return (
          <mesh>
            <boxGeometry args={[0.6, 0.6, 0.1]} />
            <meshStandardMaterial 
              color="#6B7280"
              transparent
              opacity={0.5}
              emissive="#EC4899"
              emissiveIntensity={0.2}
            />
          </mesh>
        );
      
      default:
        return (
          <mesh>
            <cylinderGeometry args={[0.5, 0.5, 1]} />
            <meshStandardMaterial color="#6B7280" />
          </mesh>
        );
    }
  };

  return (
    <group 
      ref={meshRef} 
      position={[(obstacle.x - 200) / 50, 1, -obstacle.y / 100]}
    >
      {renderObstacle()}
    </group>
  );
};

// Ambiente temático dinâmico
const ThematicEnvironment = ({ scenery }: { scenery: string }) => {
  const groundRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groundRef.current) {
      groundRef.current.position.z += 0.1;
      if (groundRef.current.position.z > 10) {
        groundRef.current.position.z = -50;
      }
    }
    
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.001;
    }
  });

  const getEnvironmentColor = () => {
    switch (scenery) {
      case 'garden': return '#A8D5BA';
      case 'forest': return '#10B981';
      case 'sky': return '#B9B5F6';
      default: return '#A8D5BA';
    }
  };

  return (
    <>
      {/* Névoa atmosférica */}
      <fog attach="fog" args={[getEnvironmentColor(), 10, 50]} />
      
      {/* Chão flutuante com plataformas orgânicas */}
      <group>
        {Array.from({ length: 20 }).map((_, i) => (
          <FloatingPlatform
            key={i}
            position={[
              (Math.random() - 0.5) * 20,
              -2 + Math.random() * 0.5,
              -i * 8
            ]}
            type={['stone', 'leaf', 'cushion'][Math.floor(Math.random() * 3)]}
          />
        ))}
      </group>
      
      {/* Trilhas de luz conectando plataformas */}
      <mesh position={[0, -1.5, -20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 100]} />
        <meshStandardMaterial 
          color={getEnvironmentColor()}
          transparent
          opacity={0.3}
          emissive={getEnvironmentColor()}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Elementos temáticos específicos */}
      {scenery === 'garden' && (
        <group ref={cloudsRef}>
          {/* Flores que se abrem */}
          {Array.from({ length: 15 }).map((_, i) => (
            <mesh key={i} position={[Math.random() * 30 - 15, 1, -i * 8]}>
              <sphereGeometry args={[0.3, 8, 6]} />
              <meshStandardMaterial 
                color="#FFD6E8"
                emissive="#FFD6E8"
                emissiveIntensity={0.3}
              />
            </mesh>
          ))}
        </group>
      )}
      
      {scenery === 'forest' && (
        <group>
          {/* Árvores estilizadas */}
          {Array.from({ length: 12 }).map((_, i) => (
            <group key={i} position={[12 - Math.random() * 24, 0, -i * 10]}>
              <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[0.3, 0.4, 3]} />
                <meshStandardMaterial color="#92400E" />
              </mesh>
              <mesh position={[0, 4, 0]}>
                <sphereGeometry args={[1.5, 8, 6]} />
                <meshStandardMaterial 
                  color="#A8D5BA"
                  emissive="#A8D5BA"
                  emissiveIntensity={0.2}
                />
              </mesh>
            </group>
          ))}
        </group>
      )}
      
      {scenery === 'sky' && (
        <group ref={cloudsRef}>
          {/* Nuvens fofas interativas */}
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh 
              key={i} 
              position={[
                Math.random() * 40 - 20, 
                3 + Math.random() * 3, 
                -i * 6
              ]}
            >
              <sphereGeometry args={[1.5 + Math.random(), 8, 6]} />
              <meshStandardMaterial 
                color="#FFFFFF"
                transparent
                opacity={0.8}
                emissive="#FFFFFF"
                emissiveIntensity={0.1}
              />
            </mesh>
          ))}
        </group>
      )}
      
      {/* Partículas de poeira brilhante no ar */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            array={new Float32Array(Array.from({ length: 300 }, () => 
              [Math.random() * 100 - 50, Math.random() * 20, Math.random() * -100]).flat())}
            count={100}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          color="#FFFFFF" 
          size={0.05} 
          transparent 
          opacity={0.6}
        />
      </points>
    </>
  );
};

// Câmera cinematográfica fluida
const CinematicCamera = ({ playerLane }: { playerLane: number }) => {
  const { camera } = useThree();
  
  useFrame((state) => {
    const targetX = (playerLane - 1) * 2;
    const time = state.clock.elapsedTime;
    
    // Movimento fluido e levemente flutuante
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = 4 + Math.sin(time * 0.5) * 0.2;
    camera.position.z = 10 + Math.sin(time * 0.3) * 0.5;
    
    // Olhar suavemente para o jogador
    camera.lookAt(targetX, 2, 0);
  });
  
  return null;
};

// Interface flutuante moderna
const FloatingUI = ({ gameState, onPause, onStop }: any) => {
  return (
    <Html position={[0, 6, 0]} center>
      <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 border border-white/30">
        {/* Volume */}
        <div className="flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-white" />
        </div>
        
        {/* Pontuação */}
        <div className="flex items-center gap-2 text-white font-medium">
          <span className="text-2xl">💙</span>
          <span>{gameState.stats.calmBubbles}</span>
        </div>
        
        <div className="flex items-center gap-2 text-white font-medium">
          <span className="text-2xl">☀️</span>
          <span>{gameState.stats.lightRays}</span>
        </div>
        
        <div className="flex items-center gap-2 text-white font-medium">
          <span className="text-2xl">🧠</span>
          <span>{gameState.stats.focusSymbols}</span>
        </div>
        
        {/* Modo zen */}
        <div className="flex items-center gap-2">
          <Leaf className={`h-5 w-5 ${gameState.player.isInZenMode ? 'text-green-400' : 'text-white/50'}`} />
        </div>
        
        {/* Controles */}
        <button 
          onClick={onPause}
          className="bg-white/30 hover:bg-white/40 text-white rounded-full p-2 transition-all"
        >
          {gameState.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
        
        <button 
          onClick={onStop}
          className="bg-white/30 hover:bg-white/40 text-white rounded-full p-2 transition-all"
        >
          <Square className="h-4 w-4" />
        </button>
      </div>
    </Html>
  );
};

// Cena principal 3D
const StylizedGame3DScene = ({ gameState, movePlayer, onPause, onStop }: any) => {
  return (
    <>
      {/* Iluminação suave difusa */}
      <ambientLight intensity={0.8} color="#FFFFFF" />
      <directionalLight 
        position={[10, 15, 5]} 
        intensity={0.6} 
        color="#FFDE59"
        castShadow
      />
      <pointLight 
        position={[0, 8, 0]} 
        intensity={0.4} 
        color="#B9B5F6" 
      />
      
      {/* Câmera cinematográfica */}
      <CinematicCamera playerLane={gameState.player.lane} />
      
      {/* Ambiente temático */}
      <ThematicEnvironment scenery={gameState.stats.currentScenery} />
      
      {/* Interface flutuante */}
      <FloatingUI 
        gameState={gameState} 
        onPause={onPause} 
        onStop={onStop} 
      />
      
      {/* Personagem estilizado */}
      <Tranquilinho 
        position={[(gameState.player.lane - 1) * 2, gameState.player.isJumping ? 3 : 1, 0]}
        isJumping={gameState.player.isJumping}
        isInZenMode={gameState.player.isInZenMode}
        hasShield={gameState.player.hasShield}
      />
      
      {/* Coletáveis estilizados */}
      {gameState.collectibles.map((collectible: any) => (
        <StylizedCollectible key={collectible.id} collectible={collectible} />
      ))}
      
      {/* Obstáculos suaves */}
      {gameState.obstacles.map((obstacle: any) => (
        <StylizedObstacle key={obstacle.id} obstacle={obstacle} />
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
      <div className="min-h-screen p-4 bg-gradient-to-br from-blue-100 via-purple-50 to-green-100">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="glassmorphism border-white/30 bg-white/20 backdrop-blur-md">
            <CardHeader className="flex-row items-center space-y-0 pb-4">
              <Button variant="ghost" size="icon" onClick={onBack} className="mr-4 text-white">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">
                <CardTitle className="text-3xl text-white mb-2">🌈 TranquiliRun+ 3D</CardTitle>
                <p className="text-white/80">
                  Uma jornada 3D de serenidade e autodescoberta
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-8xl animate-bounce">🧒🏽</div>
                <h2 className="text-2xl font-semibold text-white">Bem-vindo à Nova Tranquilândia!</h2>
                <p className="text-white/80 leading-relaxed">
                  Explore mundos 3D mágicos, colete cristais de tranquilidade 
                  e encontre sua paz interior em uma aventura visual única.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 text-center bg-white/10 border-white/20">
                  <div className="text-3xl mb-2">💙</div>
                  <h3 className="font-semibold text-white">Bolhas de Calma</h3>
                  <p className="text-xs text-white/70">Translúcidas e flutuantes</p>
                </Card>
                <Card className="p-4 text-center bg-white/10 border-white/20">
                  <div className="text-3xl mb-2">✨</div>
                  <h3 className="font-semibold text-white">Cristais de Leveza</h3>
                  <p className="text-xs text-white/70">Geometrias luminosas</p>
                </Card>
                <Card className="p-4 text-center bg-white/10 border-white/20">
                  <div className="text-3xl mb-2">🧠</div>
                  <h3 className="font-semibold text-white">Símbolos de Foco</h3>
                  <p className="text-xs text-white/70">Ícones dourados místicos</p>
                </Card>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-white">Mundos Temáticos:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <Badge variant="secondary" className="bg-green-500/20 text-white border-green-300/30">
                    🌿 Floresta Zen
                  </Badge>
                  <Badge variant="secondary" className="bg-pink-500/20 text-white border-pink-300/30">
                    🌸 Jardim da Mente
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-500/20 text-white border-purple-300/30">
                    ☁️ Céu da Leveza
                  </Badge>
                </div>
              </div>

              <Button 
                onClick={startGame} 
                className="w-full text-lg py-6 bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white border-0"
              >
                <Play className="mr-2 h-5 w-5" />
                Iniciar Jornada Zen 3D
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-100 to-green-200">
      {/* Canvas 3D estilizado */}
      <div style={{ height: '100vh', width: '100%' }}>
        <Canvas shadows camera={{ position: [0, 4, 10], fov: 60 }}>
          <StylizedGame3DScene 
            gameState={gameState} 
            movePlayer={movePlayer}
            onPause={pauseGame}
            onStop={endGame}
          />
        </Canvas>
        
        {/* Controles móveis estilizados */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6 md:hidden">
          <Button 
            variant="outline" 
            size="icon"
            onTouchStart={() => movePlayer('left')}
            className="glassmorphism bg-white/20 border-white/30 text-white h-16 w-16 rounded-full"
          >
            <span className="text-2xl">←</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onTouchStart={() => movePlayer('jump')}
            className="glassmorphism bg-white/20 border-white/30 text-white h-16 w-16 rounded-full"
          >
            <span className="text-2xl">↑</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onTouchStart={() => movePlayer('right')}
            className="glassmorphism bg-white/20 border-white/30 text-white h-16 w-16 rounded-full"
          >
            <span className="text-2xl">→</span>
          </Button>
        </div>

        {/* Pausa overlay estilizado */}
        {gameState.isPaused && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-sm">
            <Card className="glassmorphism p-8 text-center bg-white/20 border-white/30">
              <h3 className="text-2xl font-semibold mb-4 text-white">Momento de Pausa 🧘‍♂️</h3>
              <p className="text-white/80 mb-6">Respire profundamente e conecte-se consigo</p>
              <Button 
                onClick={pauseGame}
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white"
              >
                <Play className="mr-2 h-4 w-4" />
                Continuar Jornada
              </Button>
            </Card>
          </div>
        )}
      </div>

      {/* Game Over estilizado */}
      {!gameState.isPlaying && gameState.stats.score > 0 && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center backdrop-blur-sm">
          <Card className="glassmorphism p-8 text-center bg-white/10 border-white/20 max-w-md mx-4">
            <h2 className="text-3xl font-semibold text-white mb-6">✨ Jornada Completada!</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-300">{gameState.stats.calmBubbles}</div>
                <div className="text-white/70">Bolhas de Calma</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300">{gameState.stats.lightRays}</div>
                <div className="text-white/70">Cristais de Leveza</div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button 
                onClick={startGame}
                className="bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white"
              >
                <Play className="mr-2 h-4 w-4" />
                Nova Jornada
              </Button>
              <Button 
                variant="outline" 
                onClick={onBack}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                Explorar Outros Mundos
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TranquiliRun3D;


import { Heart, Infinity, Sparkles, Zap } from 'lucide-react';
import GameIntroduction from './GameIntroduction';

interface TranquiliMatchIntroductionProps {
  onPlay: () => void;
  onBack: () => void;
}

const TranquiliMatchIntroduction: React.FC<TranquiliMatchIntroductionProps> = ({
  onPlay,
  onBack
}) => {
  const gameStats = {
    currentLevel: 'Fase 1',
    nextLevel: 'Progresso Infinito',
    objective: 'Relaxe e combine peças sensoriais',
    bestScore: 0,
    icon: <Heart className="h-16 w-16" />
  };

  const howToPlay = [
    'Combine 3 ou mais peças iguais para eliminá-las',
    'Cada fase tem uma meta simples de combinações',
    'Sem limite de tempo - jogue no seu ritmo',
    'Ouça a trilha sonora relaxante',
    'A cada 10 fases, desbloqueie uma "Fase Zen"',
    'Colete peças especiais para efeitos calmantes'
  ];

  const colorScheme = {
    primary: 'bg-gradient-to-br from-blue-300 via-green-300 to-purple-300',
    secondary: 'bg-blue-200',
    gradient: 'from-blue-300 via-green-300 to-purple-300',
    background: 'bg-gradient-to-br from-blue-300 via-green-300 to-purple-300'
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <GameIntroduction
          gameId="tranquili-match"
          title="TranquiliMatch+"
          subtitle="Relaxamento Sensorial"
          colorScheme={colorScheme}
          stats={gameStats}
          howToPlay={howToPlay}
          onPlay={onPlay}
          onBack={onBack}
        />
        
        {/* Características especiais do jogo */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glassmorphism p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Infinity className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold">Fases Infinitas</h3>
            </div>
            <p className="text-muted-foreground">
              Jogue quantas fases quiser! Cada nível aumenta suavemente a dificuldade,
              mantendo sempre a experiência relaxante e prazerosa.
            </p>
          </div>
          
          <div className="glassmorphism p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-semibold">Experiência Sensorial</h3>
            </div>
            <p className="text-muted-foreground">
              Design visual suave, sons relaxantes de natureza e feedback tátil 
              criam uma experiência imersiva para o bem-estar.
            </p>
          </div>
          
          <div className="glassmorphism p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-6 w-6 text-purple-500" />
              <h3 className="text-lg font-semibold">Fases Zen</h3>
            </div>
            <p className="text-muted-foreground">
              A cada 10 fases, relaxe com uma fase especial sem objetivos,
              onde você pode apenas combinar peças livremente.
            </p>
          </div>
          
          <div className="glassmorphism p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-6 w-6 text-pink-500" />
              <h3 className="text-lg font-semibold">Progresso Salvo</h3>
            </div>
            <p className="text-muted-foreground">
              Seu progresso é automaticamente salvo na sua conta Tranquili+.
              Continue de onde parou em qualquer dispositivo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranquiliMatchIntroduction;

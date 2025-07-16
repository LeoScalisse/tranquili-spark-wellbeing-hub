import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAudio } from '@/contexts/AudioContext';
import { MENTAL_PATHS, MentalPath } from '@/types/onboarding';

interface OnboardingStep3Props {
  onNext: (mentalPath: MentalPath) => void;
  userName: string;
}

const OnboardingStep3 = ({ onNext, userName }: OnboardingStep3Props) => {
  const [selectedPath, setSelectedPath] = useState<MentalPath | null>(null);
  const { playClickSound } = useAudio();

  const handlePathSelect = (pathId: MentalPath) => {
    setSelectedPath(pathId);
    playClickSound();
  };

  const handleNext = () => {
    if (selectedPath) {
      playClickSound();
      onNext(selectedPath);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Partículas flutuantes */}
      <div className="floating-particles" style={{ top: '10%', left: '20%' }}></div>
      <div className="floating-particles" style={{ top: '20%', right: '30%' }}></div>
      <div className="floating-particles" style={{ bottom: '30%', left: '10%' }}></div>
      <div className="floating-particles" style={{ bottom: '20%', right: '20%' }}></div>

      {/* Mascote Leo */}
      <div className="mb-8 animate-fade-in">
        <div className="text-6xl mb-4 animate-bounce-soft">
          🧭
        </div>
        <div className="text-xs text-foreground/60 font-medium">Leo</div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-3xl space-y-8 animate-fade-in w-full">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground leading-tight">
            Qual caminho sua mente mais precisa agora, {userName}?
          </h1>
          <p className="text-lg text-foreground/70">
            Escolha o que mais representa o que você está buscando neste momento. 
            Você poderá mudar depois.
          </p>
        </div>

        {/* Cards de caminhos mentais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {MENTAL_PATHS.map((path) => (
            <Card
              key={path.id}
              className={`
                p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg 
                glassmorphism touch-target
                ${selectedPath === path.id 
                  ? 'ring-2 ring-accent bg-accent/10 animate-pulse-glow' 
                  : 'hover:bg-white/5'
                }
              `}
              onClick={() => handlePathSelect(path.id)}
            >
              <div className="text-center space-y-4">
                <div className="text-4xl mb-3">
                  {path.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {path.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {path.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {selectedPath && (
          <Button 
            onClick={handleNext}
            size="lg"
            className="mt-8 px-8 py-4 text-lg font-semibold rounded-full animate-fade-in touch-target"
          >
            Continuar
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardingStep3;
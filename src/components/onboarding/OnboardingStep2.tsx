import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAudio } from '@/contexts/AudioContext';

interface OnboardingStep2Props {
  onNext: (name: string) => void;
}

const OnboardingStep2 = ({ onNext }: OnboardingStep2Props) => {
  const [name, setName] = useState('');
  const { playClickSound } = useAudio();

  const handleNext = () => {
    if (name.trim().length > 0) {
      playClickSound();
      onNext(name.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim().length > 0) {
      handleNext();
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
          😊
        </div>
        <div className="text-xs text-foreground/60 font-medium">Leo</div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-lg space-y-8 animate-fade-in w-full">
        <h1 className="text-3xl font-bold text-foreground leading-tight">
          Como posso te chamar durante essa jornada?
        </h1>

        <div className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite seu nome aqui..."
            className="text-lg py-4 px-6 text-center rounded-full glassmorphism"
            autoFocus
          />
        </div>

        <Button 
          onClick={handleNext}
          disabled={name.trim().length === 0}
          size="lg"
          className="mt-8 px-8 py-4 text-lg font-semibold rounded-full touch-target disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default OnboardingStep2;
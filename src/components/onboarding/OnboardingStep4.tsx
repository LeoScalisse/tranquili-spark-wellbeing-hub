import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAudio } from '@/contexts/AudioContext';

interface OnboardingStep4Props {
  onNext: (personalWhy: string) => void;
  userName: string;
}

const OnboardingStep4 = ({ onNext, userName }: OnboardingStep4Props) => {
  const [personalWhy, setPersonalWhy] = useState('');
  const { playClickSound } = useAudio();

  const handleNext = () => {
    if (personalWhy.trim().length > 0) {
      playClickSound();
      onNext(personalWhy.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Partículas flutuantes */}
      <div className="floating-particles" style={{ top: '10%', left: '20%' }}></div>
      <div className="floating-particles" style={{ top: '20%', right: '30%' }}></div>
      <div className="floating-particles" style={{ bottom: '30%', left: '10%' }}></div>
      <div className="floating-particles" style={{ bottom: '20%', right: '20%' }}></div>

      {/* Mascote Leo com lanterna */}
      <div className="mb-8 animate-fade-in">
        <div className="mb-4 animate-bounce-soft relative">
          <img 
            src="/src/assets/leo-character.png" 
            alt="Leo - seu guia da mente" 
            className="w-24 h-24 mx-auto object-contain"
          />
          <div className="absolute -top-2 -right-2 text-3xl animate-pulse">
            🔦
          </div>
        </div>
        <div className="text-xs text-yellow-300 font-medium">Leo</div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-2xl space-y-8 animate-fade-in w-full">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-yellow-300 leading-tight">
            Agora me conta uma coisa, {userName}…
          </h1>
          <div className="space-y-3 text-lg text-yellow-100">
            <p>
              Por que esse caminho importa pra você agora?
            </p>
            <p className="font-medium">
              Em uma frase, diga o que você está buscando.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Textarea
            value={personalWhy}
            onChange={(e) => setPersonalWhy(e.target.value)}
            placeholder="Escreva com o coração…"
            className="min-h-24 text-lg p-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder:text-white/50 focus:border-yellow-300/50 focus:ring-yellow-300/20"
            autoFocus
          />
          
          <div className="text-sm text-yellow-200/70 italic">
            💝 Essa frase será guardada como âncora emocional na sua jornada
          </div>
        </div>

        <Button 
          onClick={handleNext}
          disabled={personalWhy.trim().length === 0}
          size="lg"
          className="mt-8 px-8 py-4 text-lg font-semibold rounded-full touch-target disabled:opacity-50 disabled:cursor-not-allowed bg-yellow-400 text-blue-900 hover:bg-yellow-300"
        >
          Guardar meu porquê
        </Button>
      </div>
    </div>
  );
};

export default OnboardingStep4;
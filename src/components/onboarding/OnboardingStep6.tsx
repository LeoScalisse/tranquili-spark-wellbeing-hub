import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAudio } from '@/contexts/AudioContext';
import { MICRO_ACTIONS, MentalPath } from '@/types/onboarding';

interface OnboardingStep6Props {
  onComplete: () => void;
  userName: string;
  mentalPath: MentalPath;
}

const OnboardingStep6 = ({ onComplete, userName, mentalPath }: OnboardingStep6Props) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const { playClickSound } = useAudio();

  const microAction = MICRO_ACTIONS[mentalPath];

  useEffect(() => {
    // Auto completar após 8 segundos
    const timer = setTimeout(() => {
      setIsCompleted(true);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleComplete = () => {
    playClickSound();
    onComplete();
  };

  const handleTryNow = () => {
    playClickSound();
    setIsCompleted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Partículas flutuantes */}
      <div className="floating-particles" style={{ top: '10%', left: '20%' }}></div>
      <div className="floating-particles" style={{ top: '20%', right: '30%' }}></div>
      <div className="floating-particles" style={{ bottom: '30%', left: '10%' }}></div>
      <div className="floating-particles" style={{ bottom: '20%', right: '20%' }}></div>

      {/* Mascote Leo */}
      <div className="mb-8 animate-fade-in">
        <div className="text-8xl mb-4 animate-bounce-soft">
          🧘‍♂️
        </div>
        <div className="text-xs text-blue-600 font-medium">Leo</div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-2xl space-y-8 animate-fade-in w-full">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-blue-900 leading-tight">
            Perfeito, {userName}!
          </h1>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-blue-200 shadow-lg">
            <p className="text-xl text-blue-800 leading-relaxed font-medium">
              {microAction}
            </p>
          </div>

          <div className="text-blue-700">
            <p className="text-lg">
              Sinta esse momento. Você acabou de dar o primeiro passo.
            </p>
          </div>
        </div>

        {!isCompleted ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="animate-pulse text-blue-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleTryNow}
              variant="outline"
              className="px-6 py-3 rounded-full border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Experimentei ✨
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            <div className="text-green-600 text-5xl animate-bounce-soft">
              ✅
            </div>
            
            <div className="text-green-800">
              <p className="text-lg font-medium">
                Fantástico! Você está pronto para começar sua jornada na Tranquili+
              </p>
            </div>

            <Button 
              onClick={handleComplete}
              size="lg"
              className="mt-8 px-8 py-4 text-lg font-semibold rounded-full touch-target bg-green-600 hover:bg-green-700"
            >
              Iniciar minha jornada →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingStep6;
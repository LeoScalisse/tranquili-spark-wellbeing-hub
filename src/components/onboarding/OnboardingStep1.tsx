import { Button } from '@/components/ui/button';
import { useAudio } from '@/contexts/AudioContext';

interface OnboardingStep1Props {
  onNext: () => void;
}

const OnboardingStep1 = ({ onNext }: OnboardingStep1Props) => {
  const { playClickSound } = useAudio();

  const handleNext = () => {
    playClickSound();
    onNext();
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
        <div className="text-8xl mb-4 animate-bounce-soft">
          🧘‍♂️
        </div>
        <div className="text-xs text-foreground/60 font-medium">Leo</div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-lg space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground leading-tight">
          Olá, viajante da mente! 
          <br />
          <span className="text-accent">Sou Leo</span>, e vou te guiar nessa jornada interior.
        </h1>

        <div className="space-y-4 text-lg text-foreground/80 leading-relaxed">
          <p>
            Você não está sozinho se sente que sua mente te sabota às vezes.
          </p>
          <p>
            Aqui, na <span className="font-bold text-primary">Tranquili<span className="tranquili-plus">+</span></span>, 
            acreditamos que cuidar da mente é o primeiro passo pra transformar tudo ao nosso redor.
          </p>
          <p>
            Juntos, vamos cultivar <span className="text-accent font-semibold">foco, clareza e bem-estar</span> — com leveza.
          </p>
        </div>

        <Button 
          onClick={handleNext}
          size="lg"
          className="mt-8 px-8 py-4 text-lg font-semibold rounded-full animate-pulse-glow touch-target"
        >
          Começar
        </Button>
      </div>
    </div>
  );
};

export default OnboardingStep1;
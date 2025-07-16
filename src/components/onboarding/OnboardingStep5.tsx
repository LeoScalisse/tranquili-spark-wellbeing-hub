import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAudio } from '@/contexts/AudioContext';

interface OnboardingStep5Props {
  onNext: () => void;
  userName: string;
}

const OnboardingStep5 = ({ onNext, userName }: OnboardingStep5Props) => {
  const { playClickSound } = useAudio();

  const handleNext = () => {
    playClickSound();
    onNext();
  };

  const journeySteps = [
    {
      title: 'Criação',
      description: 'Pequenos hábitos para ativar sua mente e bem-estar.',
      icon: '🌱',
      color: 'from-green-400 to-emerald-500'
    },
    {
      title: 'Consistência',
      description: 'Comece devagar. Depois, evoluímos.',
      icon: '🔄',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      title: 'Desafios',
      description: 'Propostas práticas e suaves com base no que você precisa.',
      icon: '🎯',
      color: 'from-purple-400 to-violet-500'
    },
    {
      title: 'Evolução',
      description: 'Você desbloqueia níveis e versões mais presentes de si.',
      icon: '📈',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      title: 'Transformação',
      description: 'Calma e foco se tornam parte de quem você é.',
      icon: '✨',
      color: 'from-pink-400 to-rose-500'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Partículas flutuantes */}
      <div className="floating-particles" style={{ top: '10%', left: '20%' }}></div>
      <div className="floating-particles" style={{ top: '20%', right: '30%' }}></div>
      <div className="floating-particles" style={{ bottom: '30%', left: '10%' }}></div>
      <div className="floating-particles" style={{ bottom: '20%', right: '20%' }}></div>

      {/* Mascote Leo caminhando */}
      <div className="mb-8 animate-fade-in">
        <div className="text-6xl mb-4 animate-bounce-soft">
          🚶‍♂️
        </div>
        <div className="text-xs text-foreground/60 font-medium">Leo</div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl space-y-8 animate-fade-in w-full">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground leading-tight">
            Sua jornada começa aqui, {userName}.
          </h1>
          <p className="text-lg text-foreground/70">
            Na <span className="font-bold text-primary">Tranquili<span className="tranquili-plus">+</span></span>, 
            a gente acredita em passos leves e consistentes.
          </p>
        </div>

        {/* Caminho da jornada */}
        <div className="relative">
          {/* Linha curva conectando as etapas */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-accent/30 via-primary/50 to-accent/30 transform -translate-y-1/2 hidden md:block"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {journeySteps.map((step, index) => (
              <Card
                key={step.title}
                className="relative p-6 glassmorphism hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Número da etapa */}
                <div className={`
                  absolute -top-3 -left-3 w-8 h-8 rounded-full 
                  bg-gradient-to-br ${step.color} 
                  flex items-center justify-center text-white font-bold text-sm
                  shadow-lg
                `}>
                  {index + 1}
                </div>

                <div className="text-center space-y-3">
                  <div className="text-3xl mb-3">
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleNext}
          size="lg"
          className="mt-8 px-8 py-4 text-lg font-semibold rounded-full animate-pulse-glow touch-target"
        >
          Avançar para minha jornada
        </Button>
      </div>
    </div>
  );
};

export default OnboardingStep5;
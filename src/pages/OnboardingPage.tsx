import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import leoCharacter from '@/assets/leo-character.jpg';

interface OnboardingData {
  userName: string;
  mentalPath: string;
}

type OnboardingStep = 'welcome' | 'name' | 'path' | 'journey';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    userName: '',
    mentalPath: ''
  });

  const mentalPaths = [
    {
      id: 'paz-interna',
      title: 'Paz Interna',
      emoji: '🧘‍♀️',
      description: 'Quero aprender a silenciar minha mente, reduzir a ansiedade e me sentir mais presente.'
    },
    {
      id: 'foco-clareza',
      title: 'Foco e Clareza',
      emoji: '🎯',
      description: 'Preciso superar distrações, organizar meus pensamentos e tomar decisões com mais confiança.'
    },
    {
      id: 'autoconfianca-energia',
      title: 'Autoconfiança e Energia',
      emoji: '⚡',
      description: 'Quero me sentir mais forte, motivado(a) e seguro(a) para agir, sem me sabotar.'
    },
    {
      id: 'conexao-relacoes',
      title: 'Conexão e Relações',
      emoji: '💞',
      description: 'Desejo me sentir mais conectado(a) com quem importa e cultivar vínculos saudáveis.'
    }
  ];

  const handleNameSubmit = () => {
    if (onboardingData.userName.trim()) {
      setCurrentStep('path');
    }
  };

  const handlePathSelect = (pathId: string) => {
    setOnboardingData(prev => ({ ...prev, mentalPath: pathId }));
    setCurrentStep('journey');
  };

  const handleComplete = () => {
    // Salvar no localStorage que o onboarding foi completado
    localStorage.setItem('onboarding-completed', 'true');
    localStorage.setItem('onboarding-data', JSON.stringify(onboardingData));
    navigate('/auth');
  };

  const renderWelcomeStep = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <div className="mb-8">
          <img 
            src={leoCharacter} 
            alt="Leo - Seu guia na jornada interior" 
            className="w-32 h-32 mx-auto rounded-full object-cover shadow-xl ring-4 ring-primary/20"
          />
        </div>
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">
            Olá! Sou Leo, e estou aqui pra te guiar nessa jornada interior.
          </h1>
          
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Você já sentiu que sua mente poderia ser sua aliada, mas às vezes ela parece ir contra você? 
              Ansiedade, distração, autocobrança...
            </p>
            <p>
              Muitas pessoas já estão aqui porque decidiram cuidar do que têm de mais valioso: a própria saúde mental.
            </p>
            <p className="text-foreground font-medium">
              Elas — e eu — vamos te acompanhar nesse caminho. Vamos juntos trazer de volta a clareza, 
              o foco e a calma que existem em você.
            </p>
          </div>
        </div>
        
        <Button 
          onClick={() => setCurrentStep('name')} 
          size="lg" 
          className="w-full mt-8 h-12 text-lg hover-scale"
        >
          Começar
        </Button>
      </div>
    </div>
  );

  const renderNameStep = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-6">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="text-center mb-8">
          <img 
            src={leoCharacter} 
            alt="Leo" 
            className="w-20 h-20 mx-auto rounded-full object-cover shadow-lg ring-2 ring-primary/20 mb-6"
          />
          
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Como você quer que eu te chame durante esse caminho em busca da sua calma?
          </h2>
        </div>
        
        <div className="space-y-6">
          <Input
            type="text"
            placeholder="Seu nome"
            value={onboardingData.userName}
            onChange={(e) => setOnboardingData(prev => ({ ...prev, userName: e.target.value }))}
            onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
            className="h-12 text-lg text-center"
            autoFocus
          />
          
          {onboardingData.userName.trim() && (
            <Button 
              onClick={handleNameSubmit} 
              size="lg" 
              className="w-full h-12 text-lg animate-fade-in hover-scale"
            >
              Continuar
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const renderPathStep = () => (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-6">
      <div className="max-w-2xl mx-auto py-8 space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <img 
            src={leoCharacter} 
            alt="Leo" 
            className="w-16 h-16 mx-auto rounded-full object-cover shadow-lg ring-2 ring-primary/20"
          />
          
          <h2 className="text-2xl font-bold text-foreground">
            Boas-vindas, {onboardingData.userName}! Parabéns por se preocupar com o seu mais valioso bem.
          </h2>
          
          <div className="space-y-2">
            <p className="text-xl font-semibold text-foreground">
              Qual caminho sua mente mais precisa neste momento?
            </p>
            <p className="text-muted-foreground">
              Escolha o que mais representa sua busca agora. Você poderá mudar isso depois, se quiser.
            </p>
          </div>
        </div>
        
        <div className="grid gap-4">
          {mentalPaths.map((path) => (
            <Card 
              key={path.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-2 ${
                onboardingData.mentalPath === path.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handlePathSelect(path.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">{path.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {path.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {path.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {onboardingData.mentalPath && (
          <div className="text-center animate-fade-in">
            <Button 
              onClick={() => setCurrentStep('journey')} 
              size="lg" 
              className="w-full max-w-sm h-12 text-lg hover-scale"
            >
              Continuar
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  const renderJourneyStep = () => {
    const selectedPath = mentalPaths.find(path => path.id === onboardingData.mentalPath);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-6">
        <div className="max-w-2xl mx-auto py-8 space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <img 
              src={leoCharacter} 
              alt="Leo" 
              className="w-16 h-16 mx-auto rounded-full object-cover shadow-lg ring-2 ring-primary/20"
            />
            
            <h2 className="text-2xl font-bold text-foreground">
              Perfeito! Sua jornada rumo a mais {selectedPath?.title} começa agora.
            </h2>
            
            <p className="text-xl text-muted-foreground">
              Aqui na Tranquili+, a jornada é como um jogo — só que o prêmio é você voltar a ser seu próprio aliado.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-card border">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Criação</h3>
                <p className="text-muted-foreground">
                  Vamos criar micro-hábitos que aumentam sua energia, sua clareza e sua conexão com você mesmo.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-card border">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Consistência</h3>
                <p className="text-muted-foreground">
                  Tudo começa pequeno. Vamos construir o seu ritmo com calma, e aos poucos ir mais longe.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-card border">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Desafios</h3>
                <p className="text-muted-foreground">
                  Você vai ganhar desafios personalizados, baseados no que realmente importa pra você.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-card border">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">4</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Evolução</h3>
                <p className="text-muted-foreground">
                  A cada passo, você vai desbloqueando novas versões suas — com mais foco, leveza e bem-estar.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground flex items-center justify-center font-bold text-sm">5</div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Transformação</h3>
                <p className="text-muted-foreground">
                  Com o tempo, você se sentirá mais inteiro. E tudo ao seu redor começa a ganhar mais cor.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={handleComplete} 
              size="lg" 
              className="w-full max-w-sm h-12 text-lg hover-scale bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              Começar Minha Jornada
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeStep();
      case 'name':
        return renderNameStep();
      case 'path':
        return renderPathStep();
      case 'journey':
        return renderJourneyStep();
      default:
        return renderWelcomeStep();
    }
  };

  return renderCurrentStep();
};

export default OnboardingPage;
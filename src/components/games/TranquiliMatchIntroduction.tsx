
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Sparkles, Heart, Leaf, Moon, Droplets } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

interface TranquiliMatchIntroductionProps {
  onPlay: () => void;
  onBack: () => void;
}

const TranquiliMatchIntroduction: React.FC<TranquiliMatchIntroductionProps> = ({ onPlay, onBack }) => {
  const { playClickSound } = useAudio();

  const handlePlay = () => {
    playClickSound();
    onPlay();
  };

  const handleBack = () => {
    playClickSound();
    onBack();
  };

  const pieces = [
    { name: 'Bolhas de Calma', icon: <div className="w-8 h-8 rounded-full bg-blue-400 shadow-lg"></div>, color: '#38B6FF' },
    { name: 'Folhas Zen', icon: <Leaf className="h-8 w-8 text-green-400" />, color: '#A8D5BA' },
    { name: 'Gotas de Chá', icon: <Droplets className="h-8 w-8 text-yellow-400" />, color: '#FFDE59' },
    { name: 'Luas do Sono', icon: <Moon className="h-8 w-8 text-purple-300" />, color: '#CDB4DB' }
  ];

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="glassmorphism">
          <CardHeader className="flex-row items-center space-y-0 pb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Sparkles className="h-6 w-6 text-accent" />
                TranquiliMatch+
              </CardTitle>
              <p className="text-muted-foreground">
                Um jogo match-3 para relaxar e acalmar a mente
              </p>
            </div>
          </CardHeader>
        </Card>

        <Card className="glassmorphism">
          <CardContent className="p-6 space-y-6">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🧘‍♀️</div>
              <h2 className="text-xl font-semibold text-[#38B6FF]">
                Bem-vindo ao TranquiliMatch+
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Combine elementos da natureza em um jogo relaxante e sensorial. 
                Sem pressa, sem estresse - apenas momentos de tranquilidade.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-center">Como Jogar:</h3>
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <span className="text-lg">🎯</span>
                  <span>Combine 3 ou mais peças iguais para removê-las</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-lg">✨</span>
                  <span>Crie peças especiais combinando 4 ou 5 elementos</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                  <span className="text-lg">🎵</span>
                  <span>Ouça sons relaxantes a cada movimento</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <span className="text-lg">🌙</span>
                  <span>Desbloqueie fases zen especiais a cada 10 níveis</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium text-center">Peças do Jogo:</h3>
              <div className="grid grid-cols-2 gap-3">
                {pieces.map((piece, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                    {piece.icon}
                    <span className="text-sm font-medium">{piece.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="bg-[#38B6FF]/20 text-[#38B6FF]">
                Relaxante
              </Badge>
              <Badge variant="secondary" className="bg-[#A8D5BA]/20 text-[#A8D5BA]">
                Sem Tempo
              </Badge>
              <Badge variant="secondary" className="bg-[#FFDE59]/20 text-[#FFDE59]">
                Fases Infinitas
              </Badge>
              <Badge variant="secondary" className="bg-[#CDB4DB]/20 text-[#CDB4DB]">
                Sons Sensoriais
              </Badge>
            </div>

            <div className="text-center space-y-4 pt-4">
              <Button 
                onClick={handlePlay}
                className="w-full bg-gradient-to-r from-[#38B6FF] to-[#CDB4DB] hover:from-[#38B6FF]/90 hover:to-[#CDB4DB]/90 text-white font-medium py-3 text-lg"
              >
                <Heart className="h-5 w-5 mr-2" />
                Começar Jornada Relaxante
              </Button>
              
              <p className="text-xs text-muted-foreground">
                💡 Dica: Use fones de ouvido para uma experiência sensorial completa
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TranquiliMatchIntroduction;

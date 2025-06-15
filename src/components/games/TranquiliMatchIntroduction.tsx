
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Sparkles, Heart, Infinity, Volume2 } from 'lucide-react';

interface TranquiliMatchIntroductionProps {
  onPlay: () => void;
  onBack: () => void;
}

const TranquiliMatchIntroduction: React.FC<TranquiliMatchIntroductionProps> = ({ onPlay, onBack }) => {
  const features = [
    {
      icon: <Infinity className="h-5 w-5" />,
      title: "Fases Infinitas",
      description: "Progresso contínuo sem limites com dificuldade crescente"
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: "100% Relaxante",
      description: "Sem tempo limite, sem estresse, apenas tranquilidade"
    },
    {
      icon: <Volume2 className="h-5 w-5" />,
      title: "Áudio Lo-fi",
      description: "Trilha sonora calmante com sons da natureza"
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Efeitos Sensoriais",
      description: "Vibrações suaves e feedback visual relaxante"
    }
  ];

  const gamepieces = [
    { name: "Bolhas de Calma", color: "bg-blue-200", emoji: "🫧" },
    { name: "Folhas Zen", color: "bg-green-200", emoji: "🍃" },
    { name: "Gotas de Chá", color: "bg-yellow-200", emoji: "💧" },
    { name: "Luas do Sono", color: "bg-purple-200", emoji: "🌙" }
  ];

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="glassmorphism">
          <CardHeader className="flex-row items-center space-y-0 pb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 text-center">
              <div className="text-6xl mb-4">🧩✨</div>
              <CardTitle className="text-3xl font-bold text-blue-600 mb-2">
                TranquiliMatch+
              </CardTitle>
              <p className="text-lg text-muted-foreground">
                O jogo match-3 mais relaxante que você já jogou
              </p>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                Como Jogar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center font-semibold">1</div>
                  <div>
                    <p className="font-medium">Combine 3 ou mais peças iguais</p>
                    <p className="text-sm text-muted-foreground">Arraste para trocar peças adjacentes</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500 text-white text-sm flex items-center justify-center font-semibold">2</div>
                  <div>
                    <p className="font-medium">Complete os objetivos da fase</p>
                    <p className="text-sm text-muted-foreground">Cada fase tem uma meta simples e relaxante</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500 text-white text-white text-sm flex items-center justify-center font-semibold">3</div>
                  <div>
                    <p className="font-medium">Respire e relaxe</p>
                    <p className="text-sm text-muted-foreground">Sem pressa, sem estresse - apenas diversão zen</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Peças do Jogo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {gamepieces.map((piece, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-white/50">
                    <div className={`w-8 h-8 rounded-full ${piece.color} flex items-center justify-center text-lg`}>
                      {piece.emoji}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{piece.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Recursos Especiais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-4 rounded-lg bg-white/30">
                  <div className="text-blue-500 mx-auto w-fit mb-2">
                    {feature.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-600">Pronto para relaxar?</h3>
                <p className="text-muted-foreground">
                  Seu progresso será salvo automaticamente. Respire fundo e vamos começar! 🧠✨
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={onBack} variant="outline" size="lg">
                  Voltar aos Jogos
                </Button>
                <Button onClick={onPlay} size="lg" className="bg-blue-500 hover:bg-blue-600">
                  <Play className="h-4 w-4 mr-2" />
                  Começar a Jogar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TranquiliMatchIntroduction;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Target, Brain, Heart, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface BambooTowerIntroductionProps {
  onPlay: () => void;
  onBack: () => void;
}

const BambooTowerIntroduction: React.FC<BambooTowerIntroductionProps> = ({ onPlay, onBack }) => {
  const isMobile = useIsMobile();

  const benefits = [
    { icon: Brain, text: 'Estado de Flow', color: 'text-purple-600' },
    { icon: Target, text: 'Foco e Precisão', color: 'text-blue-600' },
    { icon: Heart, text: 'Controle Emocional', color: 'text-red-600' },
    { icon: Zap, text: 'Coordenação', color: 'text-yellow-600' }
  ];

  const gameModes = [
    {
      name: 'Contemplativo',
      description: 'Velocidade lenta, sem pressão',
      difficulty: 'Fácil',
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'Harmonia',
      description: 'Progressão suave e equilibrada',
      difficulty: 'Médio',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Flow',
      description: 'Movimento rápido, foco total',
      difficulty: 'Difícil',
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "icon"}
            onClick={onBack}
            className="min-h-[44px]"
          >
            <ArrowLeft className="h-4 w-4" />
            {isMobile && <span className="ml-2">Voltar</span>}
          </Button>
          
          <div className="flex-1 text-center">
            <h1 className={`font-bold text-green-800 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
              🎋 Torre de Bambu
            </h1>
            <p className={`text-green-600 ${isMobile ? 'text-sm' : 'text-lg'}`}>
              Construa com paciência e precisão
            </p>
          </div>
        </div>

        {/* Hero Section */}
        <Card className="glassmorphism">
          <CardContent className="p-6">
            <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} items-center`}>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-green-800">
                  Uma Experiência Zen de Construção
                </h2>
                <p className="text-green-700 leading-relaxed">
                  Empilhe blocos de bambu com precisão para criar a torre mais alta possível. 
                  Cada movimento requer foco e paciência, promovendo concentração prolongada 
                  e controle emocional em um ambiente completamente relaxante.
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    🧘 Mindfulness
                  </Badge>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    🎯 Precisão
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    ⚡ Flow State
                  </Badge>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-8xl mb-4">🎋</div>
                <p className="text-green-600 italic">
                  "A precisão nasce da calma"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-green-800">🧠 Benefícios Cognitivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="text-center space-y-2">
                    <Icon className={`h-8 w-8 mx-auto ${benefit.color}`} />
                    <p className="text-sm font-medium text-gray-700">{benefit.text}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Game Modes */}
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-green-800">🎮 Modos de Jogo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
              {gameModes.map((mode, index) => (
                <div key={index} className="p-4 border border-green-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-green-800">{mode.name}</h3>
                    <Badge className={mode.color}>{mode.difficulty}</Badge>
                  </div>
                  <p className="text-sm text-green-600">{mode.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* How to Play */}
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-green-800">🎯 Como Jogar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700">📱 Controles</h4>
                <ul className="space-y-2 text-sm text-green-600">
                  <li>• <strong>Toque/Clique:</strong> Soltar o bloco</li>
                  <li>• <strong>Espaço:</strong> Soltar bloco (teclado)</li>
                  <li>• <strong>Escape:</strong> Pausar jogo</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-green-700">🎋 Mecânica</h4>
                <ul className="space-y-2 text-sm text-green-600">
                  <li>• Blocos deslizam horizontalmente</li>
                  <li>• Encaixe preciso = torre estável</li>
                  <li>• Erros cortam o excesso do bloco</li>
                  <li>• Encaixe perfeito = pontos extras</li>
                </ul>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700 text-center italic">
                💡 <strong>Dica:</strong> Respire fundo e focalize no momento presente. 
                A precisão vem da calma, não da pressa.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Play Button */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={onPlay}
            className="bg-green-600 hover:bg-green-700 text-white min-h-[44px] px-8"
          >
            <Play className="h-5 w-5 mr-2" />
            Começar a Construir
          </Button>
          
          <p className="text-sm text-green-600 mt-2">
            Tempo estimado: 5-15 minutos por sessão
          </p>
        </div>
      </div>
    </div>
  );
};

export default BambooTowerIntroduction;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play } from 'lucide-react';

interface TetrisTranquiloIntroductionProps {
  onPlay: () => void;
  onBack: () => void;
}

const TetrisTranquiloIntroduction: React.FC<TetrisTranquiloIntroductionProps> = ({ onPlay, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-10 bg-pink-50/20 rounded-full animate-float" />
        <div className="absolute top-32 right-20 w-16 h-8 bg-pink-50/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/4 w-24 h-12 bg-pink-50/20 rounded-full animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <Card className="bg-white/80 backdrop-blur-sm border-pink-200">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <Button variant="outline" onClick={onBack} size="sm" className="border-pink-200">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </div>
              
              <div className="text-center">
                <CardTitle className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  🌸 Tetris Tranquilo
                </CardTitle>
                <p className="text-xl text-pink-600">
                  Uma jornada zen através dos tons rosa da serenidade
                </p>
              </div>
            </CardHeader>
          </Card>

          {/* Game Preview */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
              <CardHeader>
                <CardTitle className="text-2xl text-pink-800 text-center">
                  🎮 Como Jogar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-pink-50/50 rounded-lg">
                    <span className="text-2xl">⬅️➡️</span>
                    <p className="text-pink-700">Use as setas para mover as peças</p>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-pink-50/50 rounded-lg">
                    <span className="text-2xl">⬆️</span>
                    <p className="text-pink-700">Seta para cima ou espaço para girar</p>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-pink-50/50 rounded-lg">
                    <span className="text-2xl">⬇️</span>
                    <p className="text-pink-700">Seta para baixo para acelerar</p>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-pink-50/50 rounded-lg">
                    <span className="text-2xl">🧘‍♀️</span>
                    <p className="text-pink-700">Respire e encontre seu ritmo zen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
              <CardHeader>
                <CardTitle className="text-2xl text-pink-800 text-center">
                  🌸 Modos de Jogo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 bg-gradient-to-r from-pink-200 to-pink-300 rounded-lg">
                    <h4 className="font-semibold text-pink-800">🌙 Modo Calmo</h4>
                    <p className="text-sm text-pink-700">Velocidade suave para relaxamento total</p>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-pink-300 to-pink-400 rounded-lg">
                    <h4 className="font-semibold text-pink-800">🎵 Modo Harmônico</h4>
                    <p className="text-sm text-pink-700">Equilíbrio entre calma e desafio</p>
                  </div>
                  
                  <div className="p-3 bg-gradient-to-r from-pink-400 to-pink-500 rounded-lg">
                    <h4 className="font-semibold text-pink-800">✨ Modo Flow</h4>
                    <p className="text-sm text-pink-700">Para entrar em estado de flow profundo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <Card className="bg-gradient-to-r from-pink-100 to-purple-100 border-pink-200">
            <CardHeader>
              <CardTitle className="text-2xl text-pink-800 text-center">
                🌺 Benefícios do Tetris Tranquilo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="p-4">
                  <div className="text-3xl mb-2">🧘‍♀️</div>
                  <h4 className="font-semibold text-pink-800">Mindfulness</h4>
                  <p className="text-sm text-pink-700">Desenvolve concentração e presença mental</p>
                </div>
                
                <div className="p-4">
                  <div className="text-3xl mb-2">💆‍♀️</div>
                  <h4 className="font-semibold text-pink-800">Relaxamento</h4>
                  <p className="text-sm text-pink-700">Reduz ansiedade e promove calma interior</p>
                </div>
                
                <div className="p-4">
                  <div className="text-3xl mb-2">✨</div>
                  <h4 className="font-semibold text-pink-800">Estado de Flow</h4>
                  <p className="text-sm text-pink-700">Alcance um estado de concentração plena</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aesthetic Preview */}
          <Card className="bg-white/70 backdrop-blur-sm border-pink-200">
            <CardHeader>
              <CardTitle className="text-2xl text-pink-800 text-center">
                🎨 Experiência Visual Zen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="flex justify-center gap-4 flex-wrap">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center">🌸</div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-300 to-pink-400 flex items-center justify-center">🌹</div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center">🌺</div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-300 to-purple-400 flex items-center justify-center">💮</div>
                </div>
                
                <p className="text-pink-700">
                  Cada peça é cuidadosamente colorida em tons rosa harmonosos, 
                  criando uma experiência visual relaxante e envolvente.
                </p>
                
                <div className="text-4xl">🧘‍♀️</div>
                <p className="text-sm text-pink-600 italic">
                  "Respire fundo nos tons rosa da serenidade"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Play Button */}
          <div className="text-center">
            <Button
              onClick={onPlay}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-3 text-lg"
            >
              <Play className="h-5 w-5 mr-2" />
              🌸 Começar Jornada Zen
            </Button>
          </div>

          {/* Final zen message */}
          <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-pink-200">
            <CardContent className="p-6 text-center">
              <p className="text-pink-700 italic">
                "Cada peça encontra seu lugar na harmonia rosa. 
                Deixe-se levar pelo ritmo suave e encontre paz interior através do jogo." 🌸
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TetrisTranquiloIntroduction;

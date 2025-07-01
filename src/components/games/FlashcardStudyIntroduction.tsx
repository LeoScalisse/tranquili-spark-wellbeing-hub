
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Brain, Target, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface FlashcardStudyIntroductionProps {
  onPlay: () => void;
  onBack: () => void;
}

const FlashcardStudyIntroduction: React.FC<FlashcardStudyIntroductionProps> = ({ onPlay, onBack }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "icon"}
            onClick={onBack}
            className="text-white hover:bg-white/20 mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
            {isMobile && <span className="ml-2">Voltar</span>}
          </Button>
          <h1 className="text-white text-2xl md:text-4xl font-bold flex-1 text-center">
            📚 Cartões de Estudo
          </h1>
        </div>

        {/* Game Info */}
        <Card className="glassmorphism border-0">
          <CardHeader className="text-center">
            <div className="mx-auto w-fit mb-4">
              <BookOpen className="h-16 w-16 text-accent" />
            </div>
            <CardTitle className="text-2xl md:text-3xl mb-4">
              Estude de Forma Inteligente
            </CardTitle>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Transforme qualquer conteúdo em cartões de estudo interativos. 
              Use a técnica de repetição espaçada para memorizar informações de forma eficaz.
            </p>
          </CardHeader>
        </Card>

        {/* Game Details */}
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
          <Card className="glassmorphism border-0">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-blue-500" />
                <h3 className="font-semibold text-lg">Como Funciona</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>Descreva um tópico ou cole um texto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>Cartões são gerados automaticamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>Estude virando os cartões</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>Navegue com setas ou cliques</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glassmorphism border-0">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Brain className="h-6 w-6 text-purple-500" />
                <h3 className="font-semibold text-lg">Benefícios</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">Memória</Badge>
                <Badge variant="secondary" className="text-xs">Concentração</Badge>
                <Badge variant="secondary" className="text-xs">Aprendizado</Badge>
                <Badge variant="secondary" className="text-xs">Retenção</Badge>
                <Badge variant="secondary" className="text-xs">Revisão</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Examples */}
        <Card className="glassmorphism border-0">
          <CardHeader>
            <CardTitle className="text-xl">Exemplos de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Idiomas</h4>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Vocabulário inglês, conjugações verbais, expressões
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Estudos</h4>
                <p className="text-sm text-green-600 dark:text-green-400">
                  História, geografia, fórmulas matemáticas
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                <h4 className="font-medium text-purple-700 dark:text-purple-300 mb-2">Trabalho</h4>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Conceitos técnicos, definições, procedimentos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Stats */}
        <Card className="glassmorphism border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-8 text-center">
              <div>
                <Clock className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Duração</p>
                <p className="font-semibold">5-20 min</p>
              </div>
              <div>
                <Target className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Dificuldade</p>
                <p className="font-semibold">Adaptável</p>
              </div>
              <div>
                <Brain className="h-6 w-6 text-accent mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Foco</p>
                <p className="font-semibold">Memória</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Play Button */}
        <div className="text-center pt-4">
          <Button
            onClick={onPlay}
            size="lg"
            className="px-8 py-4 text-lg font-medium min-w-[200px]"
          >
            🎯 Começar a Estudar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardStudyIntroduction;

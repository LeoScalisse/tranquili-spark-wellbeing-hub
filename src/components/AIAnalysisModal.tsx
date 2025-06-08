
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Brain, Heart, Lightbulb } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

interface AnalysisResult {
  summary: string;
  themes: string[];
  reflection: string;
}

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  diaryText: string;
}

const AIAnalysisModal: React.FC<AIAnalysisModalProps> = ({ isOpen, onClose, diaryText }) => {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { playSuccessSound } = useAudio();

  const analyzeText = async () => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate mock analysis based on text content
    const words = diaryText.toLowerCase();
    const themes: string[] = [];
    const emotions: string[] = [];
    
    // Simple keyword detection
    if (words.includes('trabalho') || words.includes('job') || words.includes('carreira')) {
      themes.push('Carreira');
    }
    if (words.includes('família') || words.includes('family') || words.includes('pais')) {
      themes.push('Família');
    }
    if (words.includes('amor') || words.includes('relacionamento') || words.includes('parceiro')) {
      themes.push('Relacionamentos');
    }
    if (words.includes('saúde') || words.includes('exercício') || words.includes('corpo')) {
      themes.push('Saúde');
    }
    if (words.includes('ansiedade') || words.includes('preocup') || words.includes('stress')) {
      themes.push('Bem-estar Mental');
      emotions.push('ansiedade');
    }
    if (words.includes('feliz') || words.includes('alegr') || words.includes('content')) {
      emotions.push('alegria');
    }
    if (words.includes('triste') || words.includes('melancol') || words.includes('down')) {
      emotions.push('tristeza');
    }

    if (themes.length === 0) {
      themes.push('Reflexões Pessoais');
    }

    const mockAnalysis: AnalysisResult = {
      summary: `Seu texto revela uma reflexão profunda sobre ${themes[0].toLowerCase()}${themes.length > 1 ? ` e ${themes[1].toLowerCase()}` : ''}. ${emotions.length > 0 ? `Percebo sentimentos de ${emotions.join(' e ')} em suas palavras.` : 'Suas palavras mostram um processo de autoconhecimento importante.'}`,
      themes: themes.slice(0, 3),
      reflection: emotions.includes('ansiedade') 
        ? "É natural sentir ansiedade diante dos desafios da vida. Lembre-se de que cada dificuldade é uma oportunidade de crescimento. Pratique a respiração consciente e seja gentil consigo mesmo."
        : emotions.includes('alegria')
        ? "Que maravilhoso perceber a alegria em suas palavras! Esses momentos de felicidade são preciosos e merecem ser celebrados. Continue cultivando essa positividade."
        : emotions.includes('tristeza')
        ? "A tristeza é uma emoção válida e importante. Permita-se sentir, mas lembre-se de que isso é temporário. Considere buscar apoio de pessoas queridas ou atividades que tragam conforto."
        : "Suas reflexões mostram uma pessoa consciente e em crescimento. Continue esse processo de autoconhecimento, pois ele é fundamental para seu bem-estar emocional."
    };
    
    setAnalysis(mockAnalysis);
    setIsLoading(false);
    playSuccessSound();
  };

  useEffect(() => {
    if (isOpen && diaryText) {
      setAnalysis(null);
      analyzeText();
    }
  }, [isOpen, diaryText]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphism max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            Análise da IA
          </DialogTitle>
          <DialogDescription>
            Insights sobre seus pensamentos e sentimentos
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
              <span>Analisando seu texto...</span>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Heart className="h-4 w-4 text-red-500" />
                  Resumo Emocional
                </div>
                <p className="text-sm leading-relaxed p-3 rounded-lg bg-secondary/50 border border-red-200">
                  {analysis.summary}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Brain className="h-4 w-4 text-blue-500" />
                  Temas Identificados
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.themes.map((theme, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Reflexão
                </div>
                <p className="text-sm leading-relaxed p-3 rounded-lg bg-secondary/50 border border-yellow-200">
                  {analysis.reflection}
                </p>
              </div>
              
              <Button onClick={analyzeText} variant="outline" className="w-full">
                🔄 Nova Análise
              </Button>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAnalysisModal;

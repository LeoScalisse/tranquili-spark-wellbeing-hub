
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

interface Mood {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
}

interface AIAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mood: Mood | null;
}

const AIAdviceModal: React.FC<AIAdviceModalProps> = ({ isOpen, onClose, mood }) => {
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { playSuccessSound } = useAudio();

  const generateAdvice = async () => {
    if (!mood) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const adviceTemplates: { [key: string]: string[] } = {
      happy: [
        "Que maravilha que você está feliz! 😊 Para manter esse sentimento positivo, que tal compartilhar essa alegria com alguém querido? Um simples sorriso pode iluminar o dia de outra pessoa também.",
        "Sua felicidade é contagiante! ✨ Aproveite este momento para fazer algo criativo ou começar um novo projeto que você vem adiando.",
        "Você está radiante hoje! 🌟 Considere anotar o que está te deixando feliz para relembrar nos dias mais difíceis."
      ],
      sad: [
        "É normal sentir tristeza às vezes, e está tudo bem. 💙 Permita-se sentir essa emoção, mas lembre-se de que é temporária. Que tal fazer algo gentil consigo mesmo hoje?",
        "Seus sentimentos são válidos. 🫂 Tente se conectar com a natureza, mesmo que seja olhando pela janela, ou faça uma atividade que normalmente te traz conforto.",
        "A tristeza também nos ensina sobre nós mesmos. 🌧️ Considere conversar com alguém de confiança ou escrever sobre seus sentimentos."
      ],
      calm: [
        "Que paz interior maravilhosa! 🧘‍♀️ Este é um momento perfeito para praticar gratidão e refletir sobre as coisas boas da sua vida.",
        "Sua tranquilidade é um presente. ☁️ Aproveite este estado para meditar, ler um livro ou simplesmente estar presente no momento.",
        "Você encontrou seu centro hoje! 🕊️ Considere usar este momento de calma para planejar algo importante ou apenas descansar."
      ],
      anxious: [
        "A ansiedade pode ser desafiadora, mas você não está sozinho. 🌿 Tente respirar profundamente: inspire por 4 segundos, segure por 4, expire por 6.",
        "Você é mais forte do que imagina. 💪 Quando a ansiedade surgir, tente nomear 5 coisas que você pode ver, 4 que pode tocar, 3 que pode ouvir.",
        "Está tudo bem não estar bem. 🤗 A ansiedade é sinal de que você se importa. Seja gentil consigo mesmo e lembre-se: isso também vai passar."
      ],
      excited: [
        "Sua energia está contagiante! ⚡ Canalize essa empolgação para algo produtivo ou divertido que você ama fazer.",
        "Que energia incrível! 🎉 Aproveite esse impulso para se conectar com amigos ou começar algo novo que você tem vontade.",
        "Você está irradiando positividade! ✨ Este é um ótimo momento para definir metas ou celebrar suas conquistas."
      ],
      angry: [
        "A raiva é uma emoção válida que nos mostra nossos limites. 🔥 Tente transformar essa energia em algo construtivo, como exercícios ou uma conversa honesta.",
        "Você está sentindo algo importante. 💥 Antes de reagir, tente respirar fundo e identificar o que realmente está te incomodando.",
        "Sua raiva pode ser um guia. ⚡ Use essa energia para estabelecer limites saudáveis ou fazer mudanças necessárias na sua vida."
      ]
    };

    const moodAdvice = adviceTemplates[mood.id] || adviceTemplates.happy;
    const randomAdvice = moodAdvice[Math.floor(Math.random() * moodAdvice.length)];
    
    setAdvice(randomAdvice);
    setIsLoading(false);
    playSuccessSound();
  };

  useEffect(() => {
    if (isOpen && mood) {
      setAdvice('');
      generateAdvice();
    }
  }, [isOpen, mood]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphism max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Conselho da Tranquilinha
          </DialogTitle>
          <DialogDescription>
            Baseado no seu humor: {mood?.emoji} {mood?.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
              <span>Analisando seu humor...</span>
            </div>
          ) : advice ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50 border border-accent/20">
                <p className="text-sm leading-relaxed">{advice}</p>
              </div>
              <Button onClick={generateAdvice} variant="outline" className="w-full">
                ✨ Gerar Novo Conselho
              </Button>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAdviceModal;

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAudio } from '@/contexts/AudioContext';
import AIAnalysisModal from './AIAnalysisModal';
const DiaryCard = () => {
  const [diaryText, setDiaryText] = useState('');
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const {
    playClickSound
  } = useAudio();
  const handleAnalyze = () => {
    if (diaryText.trim().length < 10) {
      return;
    }
    playClickSound();
    setShowAnalysisModal(true);
  };
  return <>
      <Card className="glassmorphism animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📔 Diário Pessoal
          </CardTitle>
          <CardDescription>Escreva seus pensamentos e deixe a Tranquili+ analisar seus sentimentos</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Textarea value={diaryText} onChange={e => setDiaryText(e.target.value)} placeholder="Como foi seu dia? O que você está sentindo? Escreva aqui seus pensamentos..." className="min-h-[120px] glassmorphism resize-none" maxLength={1000} />
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {diaryText.length}/1000 caracteres
            </span>
            
            <Button onClick={handleAnalyze} disabled={diaryText.trim().length < 10} variant="outline">🤖 Conselho do dia </Button>
          </div>
          
          {diaryText.trim().length < 10 && diaryText.length > 0 && <p className="text-xs text-muted-foreground">
              Escreva pelo menos 10 caracteres para análise
            </p>}
        </CardContent>
      </Card>

      <AIAnalysisModal isOpen={showAnalysisModal} onClose={() => setShowAnalysisModal(false)} diaryText={diaryText} />
    </>;
};
export default DiaryCard;
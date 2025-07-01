
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';

interface FlashcardCreateFormProps {
  topic: string;
  setTopic: (topic: string) => void;
  activeTab: 'describe' | 'paste';
  setActiveTab: (tab: 'describe' | 'paste') => void;
  error: string;
  onGenerateFlashcards: () => void;
  onBack: () => void;
}

const FlashcardCreateForm: React.FC<FlashcardCreateFormProps> = ({
  topic,
  setTopic,
  activeTab,
  setActiveTab,
  error,
  onGenerateFlashcards,
  onBack
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="max-w-2xl mx-auto">
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
            📚 Cartões de Estudo IA
          </h1>
        </div>
        
        {/* Error Message */}
        {error && (
          <Card className="glassmorphism border-0 mb-6">
            <CardContent className="p-4">
              <p className="text-red-600 text-center">{error}</p>
            </CardContent>
          </Card>
        )}
        
        {/* Tab Selection */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/20 p-1 rounded-full inline-flex">
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-4 md:px-6 py-2 rounded-full font-medium transition-all text-sm md:text-base ${
                activeTab === 'paste' 
                  ? 'bg-white text-gray-700 shadow-md' 
                  : 'text-white hover:text-white/90'
              }`}
            >
              Colar Texto
            </button>
            <button
              onClick={() => setActiveTab('describe')}
              className={`px-4 md:px-6 py-2 rounded-full font-medium transition-all text-sm md:text-base ${
                activeTab === 'describe' 
                  ? 'bg-white text-gray-700 shadow-md' 
                  : 'text-white hover:text-white/90'
              }`}
            >
              Descrever Tópico
            </button>
          </div>
        </div>
        
        {/* Input Area */}
        <Card className="glassmorphism border-0">
          <CardContent className="p-6 md:p-8">
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={activeTab === 'describe' 
                ? "Descreva um tópico para gerar cartões de estudo com IA...\n\nEx: História do Brasil\nEx: Fórmulas de matemática básica\nEx: Vocabulário em inglês\nEx: Conceitos de biologia"
                : "Cole seu texto aqui para gerar flashcards automáticos..."
              }
              className="min-h-[200px] text-base md:text-lg border-0 focus:ring-0 resize-none"
            />
          </CardContent>
        </Card>
        
        <Button
          onClick={onGenerateFlashcards}
          disabled={!topic.trim()}
          className="w-full mt-6 py-4 text-lg font-medium"
          size="lg"
        >
          🤖 Gerar Cartões com IA
        </Button>
      </div>
    </div>
  );
};

export default FlashcardCreateForm;

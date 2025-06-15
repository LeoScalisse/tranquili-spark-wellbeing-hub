
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Play } from 'lucide-react';
import CategorySlide from './CategorySlide';
import ProgressIndicator from './ProgressIndicator';
import { useAudio } from '@/contexts/AudioContext';

export interface TrainingCategory {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  color: string;
  gradient: string;
  icon: string;
  brainArea: string;
}

const categories: TrainingCategory[] = [
  {
    id: 'attention',
    title: 'Atenção',
    subtitle: 'FOCO E CONCENTRAÇÃO',
    description: 'Desenvolva sua capacidade de manter foco e filtrar distrações',
    benefits: [
      'Melhora da concentração',
      'Redução de distrações',
      'Maior produtividade',
      'Controle da atenção'
    ],
    color: '#FF6B6B',
    gradient: 'from-red-400 to-pink-500',
    icon: '🎯',
    brainArea: 'Córtex Pré-frontal'
  },
  {
    id: 'memory',
    title: 'Memória',
    subtitle: 'RETENÇÃO E RECORDAÇÃO',
    description: 'Fortaleça sua capacidade de armazenar e recuperar informações',
    benefits: [
      'Melhor retenção',
      'Recordação mais rápida',
      'Organização mental',
      'Aprendizado eficiente'
    ],
    color: '#4ECDC4',
    gradient: 'from-teal-400 to-cyan-500',
    icon: '🧠',
    brainArea: 'Hipocampo'
  },
  {
    id: 'processing',
    title: 'Processamento',
    subtitle: 'VELOCIDADE MENTAL',
    description: 'Acelere sua capacidade de processar informações complexas',
    benefits: [
      'Raciocínio mais rápido',
      'Tomada de decisão ágil',
      'Resolução de problemas',
      'Agilidade mental'
    ],
    color: '#45B7D1',
    gradient: 'from-blue-400 to-indigo-500',
    icon: '⚡',
    brainArea: 'Córtex Temporal'
  },
  {
    id: 'flexibility',
    title: 'Flexibilidade',
    subtitle: 'ADAPTAÇÃO MENTAL',
    description: 'Desenvolva sua capacidade de se adaptar a novas situações',
    benefits: [
      'Adaptabilidade',
      'Criatividade',
      'Mudança de perspectiva',
      'Inovação'
    ],
    color: '#96CEB4',
    gradient: 'from-green-400 to-emerald-500',
    icon: '🔄',
    brainArea: 'Córtex Frontal'
  },
  {
    id: 'inhibition',
    title: 'Inibição',
    subtitle: 'CONTROLE DE IMPULSOS',
    description: 'Melhore sua capacidade de controlar impulsos e reações',
    benefits: [
      'Autocontrole',
      'Resistência a impulsos',
      'Comportamento consciente',
      'Disciplina mental'
    ],
    color: '#FECA57',
    gradient: 'from-yellow-400 to-orange-500',
    icon: '🛡️',
    brainArea: 'Córtex Cingulado'
  },
  {
    id: 'working-memory',
    title: 'Memória de Trabalho',
    subtitle: 'MANIPULAÇÃO MENTAL',
    description: 'Fortaleça sua capacidade de manipular informações mentalmente',
    benefits: [
      'Cálculo mental',
      'Raciocínio complexo',
      'Multitarefa eficiente',
      'Organização cognitiva'
    ],
    color: '#A55EEA',
    gradient: 'from-purple-400 to-violet-500',
    icon: '🔢',
    brainArea: 'Córtex Pré-frontal Dorsolateral'
  }
];

interface TrainingObjectivesProps {
  onComplete: (selectedCategories: string[]) => void;
  onSkip: () => void;
}

const TrainingObjectives: React.FC<TrainingObjectivesProps> = ({ onComplete, onSkip }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { playGameSound } = useAudio();

  const handleNext = () => {
    if (currentSlide < categories.length - 1) {
      playGameSound('click');
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      playGameSound('click');
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    playGameSound('click');
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleComplete = () => {
    playGameSound('victory');
    onComplete(selectedCategories);
  };

  const handleSkipOnboarding = () => {
    playGameSound('click');
    onSkip();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center py-8 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Objetivos de Treino Mental
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Escolha as áreas que você gostaria de desenvolver
          </p>
        </div>

        {/* Category Slide - Now takes full available space */}
        <div className="flex-1 px-4 md:px-8">
          <Card className="h-full overflow-hidden shadow-2xl">
            <CardContent className="p-0 h-full">
              <CategorySlide 
                category={categories[currentSlide]}
                isSelected={selectedCategories.includes(categories[currentSlide].id)}
                onSelect={() => handleCategorySelect(categories[currentSlide].id)}
              />
            </CardContent>
          </Card>
        </div>

        {/* Progress Indicator */}
        <div className="py-6">
          <ProgressIndicator 
            currentSlide={currentSlide}
            totalSlides={categories.length}
            onSlideSelect={(index) => {
              playGameSound('click');
              setCurrentSlide(index);
            }}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center p-6 bg-white/50 backdrop-blur-sm">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="flex gap-4">
            <Button
              variant="ghost"
              onClick={handleSkipOnboarding}
              className="text-gray-500"
            >
              Pular Introdução
            </Button>

            {currentSlide === categories.length - 1 ? (
              <Button
                onClick={handleComplete}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center gap-2"
                disabled={selectedCategories.length === 0}
              >
                <Play className="h-4 w-4" />
                Começar Treino
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Próximo
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Selected Summary */}
        {selectedCategories.length > 0 && (
          <div className="p-6 bg-white/70 backdrop-blur-sm border-t">
            <p className="text-sm text-gray-600 mb-3">
              Áreas selecionadas para treino:
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedCategories.map(categoryId => {
                const category = categories.find(c => c.id === categoryId);
                return (
                  <span
                    key={categoryId}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: category?.color + '20',
                      color: category?.color 
                    }}
                  >
                    {category?.icon} {category?.title}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainingObjectives;

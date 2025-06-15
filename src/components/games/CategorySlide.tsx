
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { TrainingCategory } from './TrainingObjectives';

interface CategorySlideProps {
  category: TrainingCategory;
  isSelected: boolean;
  onSelect: () => void;
}

const CategorySlide: React.FC<CategorySlideProps> = ({ category, isSelected, onSelect }) => {
  return (
    <div className={`bg-gradient-to-br ${category.gradient} p-8 text-white relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 text-6xl">{category.icon}</div>
        <div className="absolute bottom-4 left-4 text-4xl opacity-50">🧠</div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-sm font-medium opacity-90 mb-1">
              {category.subtitle}
            </div>
            <h2 className="text-4xl font-bold mb-2">{category.title}</h2>
            <p className="text-lg opacity-90">{category.description}</p>
          </div>
          
          <div className="text-6xl">{category.icon}</div>
        </div>

        {/* Brain Area */}
        <div className="mb-6">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-sm font-medium">
              Área do cérebro: {category.brainArea}
            </span>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Benefícios do Treino:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {category.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selection Button */}
        <div className="flex justify-center">
          <Button
            onClick={onSelect}
            variant={isSelected ? "secondary" : "outline"}
            size="lg"
            className={`
              px-8 py-3 font-semibold transition-all duration-200
              ${isSelected 
                ? 'bg-white text-gray-800 hover:bg-gray-100' 
                : 'bg-transparent border-white text-white hover:bg-white hover:text-gray-800'
              }
            `}
          >
            {isSelected ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                Selecionado para Treino
              </>
            ) : (
              'Selecionar para Treino'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategorySlide;

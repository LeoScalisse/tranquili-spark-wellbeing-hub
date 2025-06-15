
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
    <div className={`bg-gradient-to-br ${category.gradient} h-full flex flex-col justify-center text-white relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-8 right-8 text-8xl md:text-9xl">{category.icon}</div>
        <div className="absolute bottom-8 left-8 text-6xl md:text-7xl opacity-50">🧠</div>
      </div>

      <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 md:mb-12">
          <div className="flex-1">
            <div className="text-sm md:text-base font-medium opacity-90 mb-2">
              {category.subtitle}
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-4 md:mb-6">{category.title}</h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl">{category.description}</p>
          </div>
          
          <div className="text-7xl md:text-8xl ml-8">{category.icon}</div>
        </div>

        {/* Brain Area */}
        <div className="mb-8 md:mb-12">
          <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
            <span className="text-base md:text-lg font-medium">
              Área do cérebro: {category.brainArea}
            </span>
          </div>
        </div>

        {/* Benefits */}
        <div className="mb-8 md:mb-12">
          <h3 className="text-2xl md:text-3xl font-semibold mb-6">Benefícios do Treino:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            {category.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-3 h-3 bg-white rounded-full flex-shrink-0" />
                <span className="text-base md:text-lg">{benefit}</span>
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
              px-10 py-4 text-lg font-semibold transition-all duration-200
              ${isSelected 
                ? 'bg-white text-gray-800 hover:bg-gray-100' 
                : 'bg-transparent border-white text-white hover:bg-white hover:text-gray-800'
              }
            `}
          >
            {isSelected ? (
              <>
                <Check className="h-6 w-6 mr-3" />
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

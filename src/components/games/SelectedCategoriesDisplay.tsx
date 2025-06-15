
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SelectedCategoriesDisplayProps {
  selectedCategories: string[];
}

const SelectedCategoriesDisplay: React.FC<SelectedCategoriesDisplayProps> = ({ selectedCategories }) => {
  if (selectedCategories.length === 0) return null;

  return (
    <Card className="glassmorphism">
      <CardContent className="p-4">
        <h3 className="font-medium mb-3">Suas áreas de treino selecionadas:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map(categoryId => (
            <Badge key={categoryId} variant="secondary" className="text-xs">
              {categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace('-', ' ')}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedCategoriesDisplay;

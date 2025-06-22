
import { PlantedElement } from '@/types/botanicalGarden';
import { botanicalElements } from '@/data/botanicalElements';
import { cn } from '@/lib/utils';

interface GardenGridProps {
  grid: (PlantedElement | null)[];
  onPlantClick: (position: number) => void;
  onTouchPlant: (position: number) => void;
  className?: string;
}

const GardenGrid: React.FC<GardenGridProps> = ({
  grid,
  onPlantClick,
  onTouchPlant,
  className
}) => {
  const handleSlotClick = (position: number) => {
    const plant = grid[position];
    if (plant) {
      onTouchPlant(position);
    } else {
      onPlantClick(position);
    }
  };

  return (
    <div 
      className={cn(
        "grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-1 sm:gap-2 p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-green-200",
        className
      )}
    >
      {grid.map((plant, index) => {
        const element = plant ? botanicalElements.find(el => el.id === plant.elementId) : null;
        
        return (
          <div
            key={index}
            onClick={() => handleSlotClick(index)}
            className={cn(
              "aspect-square rounded-lg border-2 transition-all duration-300 cursor-pointer flex items-center justify-center text-lg sm:text-xl md:text-2xl hover:scale-105",
              plant 
                ? "bg-white border-green-300 shadow-md hover:shadow-lg animate-pulse" 
                : "bg-green-100 border-green-200 border-dashed hover:bg-green-200"
            )}
            style={{
              animationDuration: plant ? '3s' : 'none'
            }}
          >
            {element && (
              <span 
                className="select-none animate-bounce"
                style={{ animationDuration: '2s' }}
              >
                {element.icon}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GardenGrid;

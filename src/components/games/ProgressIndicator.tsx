
interface ProgressIndicatorProps {
  currentSlide: number;
  totalSlides: number;
  onSlideSelect: (index: number) => void;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ 
  currentSlide, 
  totalSlides, 
  onSlideSelect 
}) => {
  return (
    <div className="flex justify-center items-center gap-2">
      {Array.from({ length: totalSlides }, (_, index) => (
        <button
          key={index}
          onClick={() => onSlideSelect(index)}
          className={`
            w-3 h-3 rounded-full transition-all duration-200
            ${index === currentSlide 
              ? 'bg-blue-500 scale-125' 
              : 'bg-gray-300 hover:bg-gray-400'
            }
          `}
          aria-label={`Ir para slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default ProgressIndicator;

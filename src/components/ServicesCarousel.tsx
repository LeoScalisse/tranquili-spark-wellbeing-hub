
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MessageCircle, ShoppingBag, Target, Gamepad2 } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  color: string;
}

const services: Service[] = [
  {
    id: 'chat',
    title: 'Chat com Tranquilinha',
    description: 'Converse com nossa IA especialista em bem-estar',
    icon: <MessageCircle className="h-8 w-8" />,
    route: '/chat',
    color: 'text-blue-500'
  },
  {
    id: 'shop',
    title: 'TranquiliSpace Loja',
    description: 'Produtos de bem-estar e autocuidado',
    icon: <ShoppingBag className="h-8 w-8" />,
    route: '/shop',
    color: 'text-green-500'
  },
  {
    id: 'achievements',
    title: 'Conquistas',
    description: 'Veja seus progressos e desbloqueios',
    icon: <Target className="h-8 w-8" />,
    route: '/achievements',
    color: 'text-purple-500'
  },
  {
    id: 'games',
    title: 'TranquiliGames',
    description: 'Mini-jogos relaxantes para sua mente',
    icon: <Gamepad2 className="h-8 w-8" />,
    route: '/games',
    color: 'text-orange-500'
  }
];

const ServicesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { playClickSound } = useAudio();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % services.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    playClickSound();
    setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
  };

  const goToNext = () => {
    playClickSound();
    setCurrentIndex((prev) => (prev + 1) % services.length);
  };

  const handleServiceClick = (route: string) => {
    playClickSound();
    navigate(route);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Explore Nossos Serviços</h2>
      
      <div className="relative">
        <Card className="glassmorphism overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="text-center space-y-4 max-w-md">
                <div className={`${services[currentIndex].color} mx-auto w-fit`}>
                  {services[currentIndex].icon}
                </div>
                <h3 className="text-xl font-semibold">
                  {services[currentIndex].title}
                </h3>
                <p className="text-muted-foreground">
                  {services[currentIndex].description}
                </p>
                <Button 
                  onClick={() => handleServiceClick(services[currentIndex].route)}
                  className="mt-4"
                >
                  Acessar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 glassmorphism"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 glassmorphism"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex justify-center space-x-2">
        {services.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              playClickSound();
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-accent' 
                : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesCarousel;

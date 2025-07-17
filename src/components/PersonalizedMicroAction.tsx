import { useEffect, useState } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MICRO_ACTIONS, MENTAL_PATHS } from '@/types/onboarding';
import { Heart, X } from 'lucide-react';

const PersonalizedMicroAction = () => {
  const { getMentalPath, getPersonalWhy } = useOnboarding();
  const [isVisible, setIsVisible] = useState(false);
  const [personalWhy, setPersonalWhy] = useState<string | null>(null);

  const mentalPath = getMentalPath();

  useEffect(() => {
    const loadPersonalWhy = async () => {
      const why = await getPersonalWhy();
      setPersonalWhy(why);
    };

    // Mostrar micro-ação periodicamente (a cada 30 minutos)
    const interval = setInterval(() => {
      if (mentalPath && Math.random() > 0.7) { // 30% de chance
        setIsVisible(true);
        loadPersonalWhy();
      }
    }, 30 * 60 * 1000); // 30 minutos

    // Mostrar na primeira visita após 5 minutos
    const initialTimeout = setTimeout(() => {
      if (mentalPath) {
        setIsVisible(true);
        loadPersonalWhy();
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [mentalPath, getPersonalWhy]);

  if (!isVisible || !mentalPath) return null;

  const pathInfo = MENTAL_PATHS.find(p => p.id === mentalPath);
  const microAction = MICRO_ACTIONS[mentalPath];

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in">
      <Card className="max-w-sm glassmorphism border-primary/20">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{pathInfo?.icon}</span>
              <h4 className="font-semibold text-sm">Momento Tranquili</h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-sm font-medium">{microAction}</p>

          {personalWhy && (
            <div className="bg-muted/50 p-2 rounded text-xs">
              <div className="flex items-center gap-1 mb-1">
                <Heart className="h-3 w-3 text-primary" />
                <span className="font-medium">Lembre-se:</span>
              </div>
              <p className="italic">"{personalWhy}"</p>
            </div>
          )}

          <Button
            size="sm"
            onClick={() => setIsVisible(false)}
            className="w-full"
          >
            Obrigado! ✨
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalizedMicroAction;
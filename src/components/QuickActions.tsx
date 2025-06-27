
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Trophy, Gamepad2, MessageCircle } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { useIsMobile } from '@/hooks/use-mobile';

const QuickActions = () => {
  const navigate = useNavigate();
  const { playClickSound } = useAudio();
  const isMobile = useIsMobile();

  const actions = [
    {
      title: 'Relatórios',
      description: 'Veja seu histórico de humor',
      icon: <BarChart3 className="h-6 w-6" />,
      route: '/reports',
      color: 'text-blue-500'
    },
    {
      title: 'Conquistas',
      description: 'Suas medalhas e progressos',
      icon: <Trophy className="h-6 w-6" />,
      route: '/achievements',
      color: 'text-yellow-500'
    },
    {
      title: 'Jogos',
      description: 'Mini-jogos relaxantes',
      icon: <Gamepad2 className="h-6 w-6" />,
      route: '/games',
      color: 'text-purple-500'
    },
    {
      title: 'Chat IA',
      description: 'Converse com Tranquilinha',
      icon: <MessageCircle className="h-6 w-6" />,
      route: '/chat',
      color: 'text-green-500'
    }
  ];

  const handleActionClick = (route: string) => {
    playClickSound();
    navigate(route);
  };

  return (
    <div className="space-y-4">
      <h2 className={`font-bold text-center ${isMobile ? 'text-xl' : 'text-2xl'}`}>
        Ações Rápidas
      </h2>
      
      <div className={`grid gap-4 ${
        isMobile 
          ? 'grid-cols-2' 
          : 'grid-cols-2 md:grid-cols-4'
      }`}>
        {actions.map((action) => (
          <Card 
            key={action.title}
            className={`glassmorphism hover:scale-105 transition-transform cursor-pointer ${
              isMobile ? 'active:scale-95' : ''
            }`}
            onClick={() => handleActionClick(action.route)}
          >
            <CardContent className={`text-center space-y-2 ${
              isMobile ? 'p-4 min-h-[100px]' : 'p-6'
            }`}>
              <div className={`${action.color} mx-auto w-fit`}>
                {action.icon}
              </div>
              <h3 className={`font-semibold ${isMobile ? 'text-sm' : 'text-sm'}`}>
                {action.title}
              </h3>
              <p className={`text-muted-foreground ${
                isMobile ? 'text-xs leading-tight' : 'text-xs'
              }`}>
                {action.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;

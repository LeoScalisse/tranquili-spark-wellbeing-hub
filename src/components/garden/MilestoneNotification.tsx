
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { milestones } from '@/data/botanicalElements';
import { Star, Sparkles } from 'lucide-react';

interface MilestoneNotificationProps {
  milestoneId: string | null;
}

const MilestoneNotification: React.FC<MilestoneNotificationProps> = ({ milestoneId }) => {
  const [visible, setVisible] = useState(false);
  const [milestone, setMilestone] = useState<any>(null);

  useEffect(() => {
    if (milestoneId) {
      const foundMilestone = milestones.find(m => m.id === milestoneId);
      if (foundMilestone) {
        setMilestone(foundMilestone);
        setVisible(true);

        const timer = setTimeout(() => {
          setVisible(false);
        }, 2800);

        return () => clearTimeout(timer);
      }
    }
  }, [milestoneId]);

  if (!visible || !milestone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <Card className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-300 shadow-xl animate-scale-in max-w-sm w-full">
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Star className="h-12 w-12 text-yellow-500 animate-pulse" />
              <Sparkles className="h-6 w-6 text-orange-400 absolute -top-1 -right-1 animate-bounce" />
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-yellow-800 mb-2">
            🎉 Marco Alcançado!
          </h3>
          
          <h4 className="text-lg font-semibold text-yellow-700 mb-1">
            {milestone.name}
          </h4>
          
          <p className="text-sm text-yellow-600 mb-3">
            {milestone.description}
          </p>
          
          {milestone.unlocks.length > 0 && (
            <div className="text-xs text-yellow-500">
              ✨ Novos elementos desbloqueados!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MilestoneNotification;

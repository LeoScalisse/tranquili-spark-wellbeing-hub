
import React from "react";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';
import { achievements, Achievement } from './achievementData';

interface Props {
  getProgress: (a: Achievement) => number;
  isUnlocked: (a: Achievement) => boolean;
  onClickAchievement: (a: Achievement) => void;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'mood': return 'text-blue-500';
    case 'streak': return 'text-green-500';
    case 'interaction': return 'text-purple-500';
    case 'exploration': return 'text-orange-500';
    case 'games': return 'text-red-500';
    case 'social': return 'text-pink-500';
    default: return 'text-gray-500';
  }
};

const getCategoryName = (category: string) => {
  switch (category) {
    case 'mood': return 'Humor';
    case 'streak': return 'Sequência';
    case 'interaction': return 'Interação';
    case 'exploration': return 'Exploração';
    case 'games': return 'Jogos';
    case 'social': return 'Social';
    default: return 'Geral';
  }
};

const AchievementList: React.FC<Props> = ({ getProgress, isUnlocked, onClickAchievement }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {achievements.map((achievement) => {
        const unlocked = isUnlocked(achievement);
        const progress = getProgress(achievement);
        const progressPercent = Math.min((progress / achievement.requirement) * 100, 100);

        return (
          <Card
            key={achievement.id}
            className={`
              glassmorphism transition-all duration-300 cursor-pointer
              ${unlocked 
                ? 'border-accent shadow-lg hover:scale-105' 
                : 'opacity-60 hover:opacity-80'
              }
            `}
            onClick={() => onClickAchievement(achievement)}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className={`
                ${unlocked ? getCategoryColor(achievement.category) : 'text-muted-foreground'}
                mx-auto w-fit
              `}>
                {unlocked ? achievement.icon : <Lock className="h-6 w-6" />}
              </div>
              
              <div>
                <h3 className="font-semibold mb-1">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {achievement.description}
                </p>
                <Badge variant="outline" className="text-xs">
                  {getCategoryName(achievement.category)}
                </Badge>
              </div>
              
              {!unlocked && (
                <div className="space-y-2">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-accent rounded-full h-2 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {progress}/{achievement.requirement}
                  </p>
                </div>
              )}
              
              {unlocked && (
                <Badge variant="default" className="w-full">
                  ✨ Desbloqueado!
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AchievementList;

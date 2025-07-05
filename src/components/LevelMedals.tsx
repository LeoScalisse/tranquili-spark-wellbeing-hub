
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getLevelMedals } from '@/utils/xpSystem';
import { useUser } from '@/contexts/UserContext';

const LevelMedals = () => {
  const { user } = useUser();
  const medals = getLevelMedals();

  if (!user) return null;

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏆 Medalhas de Nível
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Conquiste medalhas conforme avança nos níveis
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {medals.map((medal) => {
            const isUnlocked = user.level >= medal.level;
            const isCurrent = user.level === medal.level;
            
            return (
              <div
                key={medal.level}
                className={`
                  relative p-4 rounded-lg border-2 transition-all duration-300
                  ${isUnlocked 
                    ? 'border-accent bg-accent/10 shadow-lg' 
                    : 'border-border bg-muted/30 opacity-60'
                  }
                  ${isCurrent ? 'ring-2 ring-accent animate-pulse' : ''}
                `}
              >
                <div className="text-center space-y-2">
                  <div className="text-3xl mb-2">{medal.emoji}</div>
                  <div>
                    <h3 className={`font-bold ${medal.color}`}>
                      {medal.name}
                    </h3>
                    <Badge 
                      variant={isUnlocked ? "default" : "outline"} 
                      className="text-xs mt-1"
                    >
                      Nível {medal.level}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {medal.description}
                  </p>
                </div>
                
                {isCurrent && (
                  <div className="absolute -top-2 -right-2">
                    <Badge className="bg-yellow-500 text-yellow-50 animate-bounce">
                      Atual
                    </Badge>
                  </div>
                )}
                
                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl mb-1">🔒</div>
                      <p className="text-xs font-medium">
                        Nível {medal.level - user.level} restante{medal.level - user.level > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-accent/10 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progresso Atual:</span>
            <span className={`font-bold ${
              user.level >= 50 ? 'text-amber-500' :
              user.level >= 35 ? 'text-yellow-500' :
              user.level >= 20 ? 'text-orange-500' :
              user.level >= 10 ? 'text-purple-500' :
              user.level >= 5 ? 'text-blue-500' : 'text-green-500'
            }`}>
              Nível {user.level} - {user.xp} XP Total
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelMedals;

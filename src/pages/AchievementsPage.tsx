
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAudio } from '@/contexts/AudioContext';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy } from 'lucide-react';
import AchievementModal from '@/components/AchievementModal';
import { useAchievementAnimation } from '@/contexts/AchievementAnimationContext';
import AchievementList from './AchievementList';
import AchievementTipsCard from './AchievementTipsCard';
import { achievements, Achievement } from './achievementData';

const AchievementsPage = () => {
  const { user, unlockAchievement } = useUser();
  const { usedThemes } = useTheme();
  const { showAchievementAnimation } = useAchievementAnimation();
  const navigate = useNavigate();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showModal, setShowModal] = useState(false);

  const getProgress = (achievement: Achievement): number => {
    if (!user) return 0;

    switch (achievement.category) {
      case 'mood':
        if (achievement.id === 'level_5') {
          return user.level;
        }
        if (achievement.id === 'mood_master') {
          const uniqueMoods = new Set(user.moods.map(mood => mood.mood));
          return uniqueMoods.size;
        }
        return user.moods.length;
      case 'streak':
        return user.streak;
      case 'interaction':
        if (achievement.id === 'chat_conversationalist') {
          return parseInt(localStorage.getItem('chat_conversations_count') || '0');
        }
        return localStorage.getItem('has_chatted') ? 1 : 0;
      case 'exploration':
        if (achievement.id === 'theme_explorer') {
          return usedThemes.length;
        }
        if (achievement.id === 'report_viewer') {
          return localStorage.getItem('has_viewed_report') ? 1 : 0;
        }
        if (achievement.id === 'audio_explorer') {
          return localStorage.getItem('has_changed_audio') ? 1 : 0;
        }
        if (achievement.id === 'theme_designer') {
          return parseInt(localStorage.getItem('theme_changes_count') || '0');
        }
        return usedThemes.length;
      case 'games':
        if (achievement.id === 'games_beginner') {
          return localStorage.getItem('has_played_games') ? 1 : 0;
        }
        if (achievement.id === 'games_enthusiast') {
          const playedGames = JSON.parse(localStorage.getItem('played_games') || '[]');
          return playedGames.length;
        }
        if (achievement.id === 'tranquili_first_match') {
          const progress = localStorage.getItem(`tranquili-match-progress-${user.id}`);
          return progress ? 1 : 0;
        }
        if (achievement.id === 'tranquili_zen_master') {
          return parseInt(localStorage.getItem(`tranquili-zen-completed-${user.id}`) || '0');
        }
        if (achievement.id === 'tranquili_marathonist') {
          const progress = localStorage.getItem(`tranquili-match-progress-${user.id}`);
          if (progress) {
            const data = JSON.parse(progress);
            return data.level || 0;
          }
          return 0;
        }
        if (achievement.id === 'tranquili_collector') {
          const progress = localStorage.getItem(`tranquili-match-progress-${user.id}`);
          if (progress) {
            const data = JSON.parse(progress);
            return data.totalCollected || 0;
          }
          return 0;
        }
        return 0;
      case 'social':
        if (achievement.id === 'achievement_hunter') {
          return user.achievements.length;
        }
        if (achievement.id === 'tranquili_veteran') {
          const usageDays = JSON.parse(localStorage.getItem('app_usage_days') || '[]');
          return usageDays.length;
        }
        return 0;
      default:
        return 0;
    }
  };

  const isUnlocked = (achievement: Achievement): boolean => {
    return user?.achievements.includes(achievement.id) || false;
  };

  const checkAndUnlockAchievements = () => {
    if (!user) return;

    const achievementToUnlock = achievements.find(achievement => {
      const progress = getProgress(achievement);
      return progress >= achievement.requirement && !isUnlocked(achievement);
    });
    
    if (achievementToUnlock) {
      unlockAchievement(achievementToUnlock.id);
      showAchievementAnimation(achievementToUnlock);
    }
  };

  useEffect(() => {
    checkAndUnlockAchievements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, usedThemes.length]);

  const unlockedCount = achievements.filter(a => isUnlocked(a)).length;
  const totalCount = achievements.length;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="glassmorphism">
          <CardHeader className="flex-row items-center space-y-0 pb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Conquistas
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Seus progressos e desbloqueios na jornada de bem-estar
              </p>
            </div>
            
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {unlockedCount}/{totalCount}
            </Badge>
          </CardHeader>
        </Card>

        <AchievementList 
          getProgress={getProgress}
          isUnlocked={isUnlocked}
          onClickAchievement={(a) => {
            setSelectedAchievement(a);
            setShowModal(true);
          }}
        />

        <AchievementTipsCard />
      </div>

      <AchievementModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        achievement={selectedAchievement}
        isUnlocked={selectedAchievement ? isUnlocked(selectedAchievement) : false}
        progress={selectedAchievement ? getProgress(selectedAchievement) : 0}
      />
    </div>
  );
};

export default AchievementsPage;

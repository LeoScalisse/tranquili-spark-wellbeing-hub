
import React from 'react';
import { useAchievementAnimation } from '@/contexts/AchievementAnimationContext';
import EnhancedAchievementAnimation from './EnhancedAchievementAnimation';

const GlobalAchievementWrapper: React.FC = () => {
  const { currentAchievement, isAnimationVisible, hideAchievementAnimation } = useAchievementAnimation();

  return (
    <EnhancedAchievementAnimation
      achievement={currentAchievement}
      isVisible={isAnimationVisible}
      onAnimationEnd={hideAchievementAnimation}
    />
  );
};

export default GlobalAchievementWrapper;

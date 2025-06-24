
import { useState, useEffect } from 'react';
import TrainingObjectives from '@/components/games/TrainingObjectives';
import { useAudio } from '@/contexts/AudioContext';
import { games } from '@/components/games/GamesList';

interface OnboardingManagerProps {
  onComplete: (categories: string[]) => void;
  children: React.ReactNode;
}

const OnboardingManager: React.FC<OnboardingManagerProps> = ({ onComplete, children }) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { playGameSound } = useAudio();

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('tranquili-games-onboarding');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = (categories: string[]) => {
    setShowOnboarding(false);
    localStorage.setItem('tranquili-games-onboarding', 'true');
    localStorage.setItem('tranquili-games-categories', JSON.stringify(categories));
    onComplete(categories);
    playGameSound('victory');
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem('tranquili-games-onboarding', 'true');
    onComplete([]);
    playGameSound('click');
  };

  if (showOnboarding) {
    return (
      <TrainingObjectives
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return <>{children}</>;
};

export default OnboardingManager;

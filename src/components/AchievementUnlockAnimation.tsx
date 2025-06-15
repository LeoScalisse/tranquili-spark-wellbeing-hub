
import React, { useEffect } from 'react';
import { Trophy } from 'lucide-react';

interface Achievement {
  title: string;
}

interface AchievementUnlockAnimationProps {
  achievement: Achievement | null;
  onAnimationEnd: () => void;
}

const AchievementUnlockAnimation: React.FC<AchievementUnlockAnimationProps> = ({ achievement, onAnimationEnd }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd();
    }, 4000); // A animação dura 4 segundos

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  if (!achievement) return null;

  const sparkles = Array.from({ length: 30 }).map((_, i) => (
    <div
      key={i}
      className="sparkle"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 4}s`,
        animationDuration: `${1 + Math.random() * 2}s`,
      }}
    />
  ));

  return (
    <div className="fixed inset-0 bg-yellow-400/90 z-[100] flex flex-col items-center justify-center overflow-hidden animate-fade-in">
      {sparkles}
      <div className="relative text-center p-4 z-10 animate-zoom-in">
        <div className="text-8xl mb-6 text-yellow-600 animate-bounce-soft">
          <Trophy className="w-24 h-24 inline-block drop-shadow-lg" />
        </div>
        <h1 className="text-5xl font-bold text-white text-shadow-lg mb-2">Conquista Desbloqueada!</h1>
        <p className="text-3xl text-white/90 font-light">{achievement.title}</p>
      </div>
    </div>
  );
};

export default AchievementUnlockAnimation;

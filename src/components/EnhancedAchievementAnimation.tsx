
import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'mood' | 'streak' | 'interaction' | 'exploration';
}

interface EnhancedAchievementAnimationProps {
  achievement: Achievement | null;
  isVisible: boolean;
  onAnimationEnd: () => void;
}

const EnhancedAchievementAnimation: React.FC<EnhancedAchievementAnimationProps> = ({ 
  achievement, 
  isVisible, 
  onAnimationEnd 
}) => {
  const [showFlash, setShowFlash] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isVisible && achievement) {
      // Sequência da animação
      setShowFlash(true);
      
      setTimeout(() => {
        setShowContent(true);
      }, 200);

      const timer = setTimeout(() => {
        onAnimationEnd();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, achievement, onAnimationEnd]);

  useEffect(() => {
    if (!isVisible) {
      setShowFlash(false);
      setShowContent(false);
    }
  }, [isVisible]);

  if (!achievement || !isVisible) return null;

  // Criar partículas douradas
  const goldParticles = Array.from({ length: 50 }).map((_, i) => (
    <div
      key={`gold-${i}`}
      className="absolute w-2 h-2 bg-yellow-400 rounded-full"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 3}s`,
      }}
    />
  ));

  // Criar sparkles grandes
  const bigSparkles = Array.from({ length: 20 }).map((_, i) => (
    <div
      key={`sparkle-${i}`}
      className="absolute w-4 h-4 bg-white rounded-full animate-pulse"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 4}s`,
        boxShadow: '0 0 20px #fff, 0 0 40px #ffdd57, 0 0 60px #ffdd57',
      }}
    />
  ));

  // Criar ondas de luz
  const lightWaves = Array.from({ length: 3 }).map((_, i) => (
    <div
      key={`wave-${i}`}
      className="absolute inset-0 rounded-full border-4 border-yellow-300 opacity-30"
      style={{
        animation: `light-wave ${3 + i}s ease-out infinite`,
        animationDelay: `${i * 0.5}s`,
      }}
    />
  ));

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden">
      {/* Flash inicial */}
      {showFlash && (
        <div className="absolute inset-0 bg-yellow-400 animate-flash" />
      )}
      
      {/* Fundo principal */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-400 animate-gradient-flow">
        {/* Ondas de luz */}
        <div className="absolute inset-0 flex items-center justify-center">
          {lightWaves}
        </div>
        
        {/* Partículas douradas */}
        <div className="absolute inset-0 animate-float-particles">
          {goldParticles}
        </div>
        
        {/* Sparkles grandes */}
        <div className="absolute inset-0">
          {bigSparkles}
        </div>
        
        {/* Conteúdo da conquista */}
        {showContent && (
          <div className="relative h-full flex flex-col items-center justify-center text-center p-4 animate-achievement-appear">
            {/* Ícone principal */}
            <div className="text-white mb-8 animate-icon-celebration">
              <div className="w-32 h-32 mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/40">
                <Trophy className="w-20 h-20" />
              </div>
            </div>
            
            {/* Textos */}
            <div className="space-y-4 animate-text-reveal">
              <h1 className="text-6xl font-bold text-white drop-shadow-2xl animate-title-bounce">
                CONQUISTA
              </h1>
              <h2 className="text-5xl font-bold text-white drop-shadow-2xl animate-title-bounce">
                DESBLOQUEADA!
              </h2>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border-2 border-white/40 max-w-md mx-auto">
                <h3 className="text-3xl font-semibold text-white mb-2">
                  {achievement.title}
                </h3>
                <p className="text-xl text-white/90">
                  {achievement.description}
                </p>
              </div>
            </div>
            
            {/* Instruções */}
            <div className="mt-8 text-white/80 animate-pulse">
              <p className="text-lg">Clique para continuar ou aguarde...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Clique para fechar */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={onAnimationEnd}
      />
    </div>
  );
};

export default EnhancedAchievementAnimation;

import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import type { Achievement } from '@/contexts/AchievementAnimationContext';

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
  const isMobile = useIsMobile();

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

  // Reduzir número de partículas no mobile para melhor performance
  const particleCount = isMobile ? 25 : 50;
  const sparkleCount = isMobile ? 10 : 20;

  // Criar partículas douradas
  const goldParticles = Array.from({ length: particleCount }).map((_, i) => (
    <div
      key={`gold-${i}`}
      className={`absolute bg-yellow-400 rounded-full ${isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2'}`}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 3}s`,
      }}
    />
  ));

  // Criar sparkles grandes
  const bigSparkles = Array.from({ length: sparkleCount }).map((_, i) => (
    <div
      key={`sparkle-${i}`}
      className={`absolute bg-white rounded-full animate-pulse ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 4}s`,
        boxShadow: '0 0 20px #fff, 0 0 40px #ffdd57, 0 0 60px #ffdd57',
      }}
    />
  ));

  // Criar ondas de luz (reduzidas no mobile)
  const waveCount = isMobile ? 2 : 3;
  const lightWaves = Array.from({ length: waveCount }).map((_, i) => (
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
          <div className={`relative h-full flex flex-col items-center justify-center text-center animate-achievement-appear ${isMobile ? 'p-4' : 'p-8'}`}>
            {/* Ícone principal */}
            <div className="text-white mb-4 md:mb-8 animate-icon-celebration">
              <div className={`mx-auto bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/40 ${
                isMobile ? 'w-20 h-20' : 'w-32 h-32'
              }`}>
                <Trophy className={isMobile ? 'w-12 h-12' : 'w-20 h-20'} />
              </div>
            </div>
            
            {/* Textos */}
            <div className="space-y-2 md:space-y-4 animate-text-reveal max-w-xs md:max-w-md">
              <h1 className={`font-bold text-white drop-shadow-2xl animate-title-bounce ${
                isMobile ? 'text-3xl' : 'text-6xl'
              }`}>
                CONQUISTA
              </h1>
              <h2 className={`font-bold text-white drop-shadow-2xl animate-title-bounce ${
                isMobile ? 'text-2xl' : 'text-5xl'
              }`}>
                DESBLOQUEADA!
              </h2>
              <div className={`bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/40 mx-auto ${
                isMobile ? 'p-4 max-w-xs' : 'p-6 max-w-md'
              }`}>
                <h3 className={`font-semibold text-white mb-2 ${
                  isMobile ? 'text-xl' : 'text-3xl'
                }`}>
                  {achievement.title}
                </h3>
                <p className={`text-white/90 ${
                  isMobile ? 'text-sm' : 'text-xl'
                }`}>
                  {achievement.description}
                </p>
              </div>
            </div>
            
            {/* Instruções */}
            <div className={`text-white/80 animate-pulse ${
              isMobile ? 'mt-4 text-sm' : 'mt-8 text-lg'
            }`}>
              <p>Toque para continuar ou aguarde...</p>
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

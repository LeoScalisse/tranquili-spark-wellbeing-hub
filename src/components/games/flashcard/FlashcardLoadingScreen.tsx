
import React from 'react';

const FlashcardLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
        <h2 className="text-white text-2xl md:text-3xl font-medium mb-4">
          Claude IA está gerando seus cartões...
        </h2>
        <p className="text-white/80 text-lg">
          Isso pode levar alguns segundos...
        </p>
      </div>
    </div>
  );
};

export default FlashcardLoadingScreen;

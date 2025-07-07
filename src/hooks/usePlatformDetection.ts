
import { useState, useEffect } from 'react';

interface PlatformInfo {
  isPWA: boolean;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
  userAgent: string;
  supportsWebAudio: boolean;
  requiresUserGesture: boolean;
}

export const usePlatformDetection = (): PlatformInfo => {
  const [platformInfo, setPlatformInfo] = useState<PlatformInfo>({
    isPWA: false,
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    isStandalone: false,
    userAgent: '',
    supportsWebAudio: false,
    requiresUserGesture: true,
  });

  useEffect(() => {
    const detectPlatform = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
      const isPWA = isStandalone || window.location.search.includes('source=pwa');
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isIOS = /ipad|iphone|ipod/.test(userAgent);
      const isAndroid = /android/.test(userAgent);
      
      // Verificar suporte ao Web Audio API
      const supportsWebAudio = !!(window.AudioContext || (window as any).webkitAudioContext);
      
      // Dispositivos que requerem gesto do usuário para áudio
      const requiresUserGesture = isMobile || isIOS || isPWA;

      setPlatformInfo({
        isPWA,
        isMobile,
        isIOS,
        isAndroid,
        isStandalone,
        userAgent,
        supportsWebAudio,
        requiresUserGesture,
      });

      console.log('🔍 Plataforma detectada:', {
        isPWA,
        isMobile,
        isIOS,
        isAndroid,
        isStandalone,
        supportsWebAudio,
        requiresUserGesture,
      });
    };

    detectPlatform();

    // Detectar mudanças de display mode (útil para PWA)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = () => {
      console.log('📱 Display mode changed');
      detectPlatform();
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleDisplayModeChange);
    } else {
      // Fallback para navegadores mais antigos
      mediaQuery.addListener(handleDisplayModeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleDisplayModeChange);
      } else {
        mediaQuery.removeListener(handleDisplayModeChange);
      }
    };
  }, []);

  return platformInfo;
};

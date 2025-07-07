
import { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { usePlatformDetection } from './usePlatformDetection';

interface AudioSystemState {
  isReady: boolean;
  isInitializing: boolean;
  needsUserInteraction: boolean;
  error: string | null;
  method: 'tone' | 'webaudio' | 'html5' | 'fallback' | null;
  debugInfo: string[];
}

interface AudioSystemActions {
  initialize: () => Promise<boolean>;
  reset: () => Promise<void>;
  testAudio: () => Promise<boolean>;
  getDebugInfo: () => string[];
}

export const useAudioSystem = (): AudioSystemState & AudioSystemActions => {
  const platform = usePlatformDetection();
  const [state, setState] = useState<AudioSystemState>({
    isReady: false,
    isInitializing: false,
    needsUserInteraction: true,
    error: null,
    method: null,
    debugInfo: [],
  });

  const debugRef = useRef<string[]>([]);
  const isInitializedRef = useRef(false);

  const addDebug = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const debugMessage = `[${timestamp}] ${message}`;
    console.log(`🎵 ${debugMessage}`);
    debugRef.current = [...debugRef.current.slice(-19), debugMessage]; // Keep last 20 messages
  }, []);

  const updateState = useCallback((updates: Partial<AudioSystemState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Método 1: Tentar Tone.js (melhor qualidade)
  const initializeToneJS = useCallback(async (): Promise<boolean> => {
    try {
      addDebug('Tentando inicializar Tone.js...');
      
      // Verificar se já está rodando
      if (Tone.context.state === 'running') {
        addDebug('Tone.js já está ativo');
        return true;
      }

      // Inicializar Tone.js
      await Tone.start();
      
      if (Tone.context.state === 'running') {
        addDebug('✅ Tone.js inicializado com sucesso');
        return true;
      } else {
        throw new Error(`Estado inesperado: ${Tone.context.state}`);
      }
    } catch (error) {
      addDebug(`❌ Falha no Tone.js: ${error.message}`);
      return false;
    }
  }, [addDebug]);

  // Método 2: Web Audio API nativa
  const initializeWebAudio = useCallback(async (): Promise<boolean> => {
    try {
      addDebug('Tentando Web Audio API nativa...');
      
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) {
        throw new Error('Web Audio API não suportada');
      }

      const context = new AudioContext();
      
      if (context.state === 'suspended') {
        await context.resume();
      }

      if (context.state === 'running') {
        addDebug('✅ Web Audio API inicializada');
        context.close(); // Fechar contexto de teste
        return true;
      } else {
        throw new Error(`Estado inesperado: ${context.state}`);
      }
    } catch (error) {
      addDebug(`❌ Falha no Web Audio API: ${error.message}`);
      return false;
    }
  }, [addDebug]);

  // Método 3: HTML5 Audio (fallback básico)
  const initializeHTML5Audio = useCallback(async (): Promise<boolean> => {
    try {
      addDebug('Tentando HTML5 Audio...');
      
      const audio = new Audio();
      
      // Testar se consegue criar e reproduzir um som mudo
      const canPlay = audio.canPlayType && audio.canPlayType('audio/wav');
      
      if (canPlay) {
        addDebug('✅ HTML5 Audio disponível');
        return true;
      } else {
        throw new Error('HTML5 Audio não suportado');
      }
    } catch (error) {
      addDebug(`❌ Falha no HTML5 Audio: ${error.message}`);
      return false;
    }
  }, [addDebug]);

  // Função principal de inicialização com fallbacks
  const initialize = useCallback(async (): Promise<boolean> => {
    if (isInitializedRef.current) {
      addDebug('Sistema já inicializado');
      return state.isReady;
    }

    updateState({ 
      isInitializing: true, 
      error: null,
      debugInfo: [...debugRef.current]
    });

    addDebug(`Iniciando sistema de áudio para: ${platform.isPWA ? 'PWA' : 'Web'} ${platform.isMobile ? 'Mobile' : 'Desktop'}`);

    try {
      let success = false;
      let method: AudioSystemState['method'] = null;

      // Tentar métodos em ordem de preferência
      if (platform.supportsWebAudio) {
        // Método 1: Tone.js
        if (await initializeToneJS()) {
          success = true;
          method = 'tone';
        }
        // Método 2: Web Audio API nativa
        else if (await initializeWebAudio()) {
          success = true;
          method = 'webaudio';
        }
      }

      // Método 3: HTML5 Audio
      if (!success && await initializeHTML5Audio()) {
        success = true;
        method = 'html5';
      }

      // Método 4: Fallback visual
      if (!success) {
        addDebug('⚠️ Usando fallback visual (sem áudio)');
        success = true;
        method = 'fallback';
      }

      if (success) {
        isInitializedRef.current = true;
        updateState({
          isReady: true,
          isInitializing: false,
          needsUserInteraction: false,
          method,
          debugInfo: [...debugRef.current]
        });
        
        addDebug(`🎉 Sistema inicializado com método: ${method}`);
        
        // Salvar preferência no localStorage
        localStorage.setItem('tranquili-audio-method', method);
        localStorage.setItem('tranquili-audio-initialized', 'true');
        
        return true;
      } else {
        throw new Error('Todos os métodos de áudio falharam');
      }
    } catch (error) {
      addDebug(`🚨 Erro crítico: ${error.message}`);
      updateState({
        isReady: false,
        isInitializing: false,
        error: error.message,
        debugInfo: [...debugRef.current]
      });
      return false;
    }
  }, [platform, initializeToneJS, initializeWebAudio, initializeHTML5Audio, addDebug, updateState, state.isReady]);

  // Reset do sistema
  const reset = useCallback(async (): Promise<void> => {
    addDebug('🔄 Resetando sistema de áudio...');
    
    try {
      // Parar Tone.js se estiver rodando
      if (Tone.context.state !== 'closed') {
        await Tone.context.close();
      }
    } catch (error) {
      addDebug(`Erro ao fechar Tone.js: ${error.message}`);
    }

    isInitializedRef.current = false;
    updateState({
      isReady: false,
      isInitializing: false,
      needsUserInteraction: true,
      error: null,
      method: null,
      debugInfo: [...debugRef.current]
    });

    localStorage.removeItem('tranquili-audio-initialized');
    addDebug('✅ Sistema resetado');
  }, [addDebug, updateState]);

  // Teste de áudio
  const testAudio = useCallback(async (): Promise<boolean> => {
    if (!state.isReady) {
      addDebug('❌ Sistema não está pronto para teste');
      return false;
    }

    try {
      addDebug(`🧪 Testando áudio com método: ${state.method}`);
      
      switch (state.method) {
        case 'tone':
          if (Tone.context.state === 'running') {
            const osc = new Tone.Oscillator(440, 'sine').toDestination();
            osc.start();
            osc.stop('+0.1');
            addDebug('✅ Teste Tone.js bem-sucedido');
            return true;
          }
          break;
          
        case 'webaudio':
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          const context = new AudioContext();
          const osc = context.createOscillator();
          const gain = context.createGain();
          
          osc.connect(gain);
          gain.connect(context.destination);
          gain.gain.value = 0.1;
          osc.frequency.value = 440;
          osc.start();
          osc.stop(context.currentTime + 0.1);
          
          setTimeout(() => context.close(), 200);
          addDebug('✅ Teste Web Audio API bem-sucedido');
          return true;
          
        case 'html5':
          addDebug('✅ HTML5 Audio disponível');
          return true;
          
        case 'fallback':
          addDebug('ℹ️ Modo fallback - sem teste de áudio');
          return true;
          
        default:
          throw new Error('Método desconhecido');
      }
    } catch (error) {
      addDebug(`❌ Teste falhou: ${error.message}`);
      return false;
    }
    
    return false;
  }, [state.isReady, state.method, addDebug]);

  const getDebugInfo = useCallback(() => {
    return debugRef.current;
  }, []);

  // Verificar se há inicialização prévia salva
  useEffect(() => {
    const savedInitialized = localStorage.getItem('tranquili-audio-initialized');
    const savedMethod = localStorage.getItem('tranquili-audio-method') as AudioSystemState['method'];
    
    if (savedInitialized === 'true' && savedMethod) {
      addDebug(`📱 Detectada inicialização prévia: ${savedMethod}`);
      // Tentar restaurar estado, mas ainda requer nova interação do usuário
      updateState({
        needsUserInteraction: platform.requiresUserGesture,
        method: savedMethod
      });
    }
  }, [platform.requiresUserGesture, addDebug, updateState]);

  return {
    ...state,
    debugInfo: debugRef.current,
    initialize,
    reset,
    testAudio,
    getDebugInfo,
  };
};

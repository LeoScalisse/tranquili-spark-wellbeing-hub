
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

interface PWALifecycleState {
  updateAvailable: boolean;
  isUpdating: boolean;
  newWorker: ServiceWorker | null;
  isOnline: boolean;
  appVersion: string;
}

export const usePWALifecycle = () => {
  const [state, setState] = useState<PWALifecycleState>({
    updateAvailable: false,
    isUpdating: false,
    newWorker: null,
    isOnline: navigator.onLine,
    appVersion: '2.0.0'
  });

  const updateApp = useCallback(async () => {
    if (!state.newWorker) return;

    setState(prev => ({ ...prev, isUpdating: true }));
    
    try {
      // Enviar mensagem para o service worker para pular a espera
      state.newWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Aguardar o novo service worker assumir o controle
      await new Promise((resolve) => {
        const handleControllerChange = () => {
          navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
          resolve(true);
        };
        navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
      });

      // Recarregar a página para aplicar as atualizações
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar app:', error);
      toast({
        title: "Erro na atualização",
        description: "Não foi possível atualizar o app. Tente novamente.",
        variant: "destructive"
      });
      setState(prev => ({ ...prev, isUpdating: false }));
    }
  }, [state.newWorker]);

  const dismissUpdate = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      updateAvailable: false, 
      newWorker: null 
    }));
  }, []);

  useEffect(() => {
    // Verificar se o service worker está disponível
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker não suportado');
      return;
    }

    // Listener para mudanças de conectividade
    const handleOnline = () => setState(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setState(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar atualizações do service worker
    const checkForUpdates = async () => {
      try {
        const registration = await navigator.serviceWorker.ready;
        
        // Listener para quando um novo service worker está instalando
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nova versão disponível
              setState(prev => ({
                ...prev,
                updateAvailable: true,
                newWorker: newWorker
              }));

              toast({
                title: "Atualização disponível! 🎉",
                description: "Uma nova versão do TranquiliMais está pronta para ser instalada.",
                duration: 10000
              });
            }
          });
        });

        // Verificar se já existe uma atualização esperando
        if (registration.waiting) {
          setState(prev => ({
            ...prev,
            updateAvailable: true,
            newWorker: registration.waiting
          }));
        }

        // Verificar atualizações periodicamente
        setInterval(() => {
          registration.update();
        }, 60000); // Verificar a cada 1 minuto

      } catch (error) {
        console.error('Erro ao verificar atualizações:', error);
      }
    };

    checkForUpdates();

    // Listener para quando o service worker assume o controle
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker assumiu controle');
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    ...state,
    updateApp,
    dismissUpdate,
    canUpdate: state.updateAvailable && !state.isUpdating
  };
};

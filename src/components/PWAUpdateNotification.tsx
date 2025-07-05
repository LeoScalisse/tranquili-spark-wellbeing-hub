
import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Download, X, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { usePWALifecycle } from '@/hooks/usePWALifecycle';
import { useAudio } from '@/contexts/AudioContext';

const PWAUpdateNotification = () => {
  const { 
    updateAvailable, 
    isUpdating, 
    isOnline, 
    appVersion, 
    updateApp, 
    dismissUpdate,
    canUpdate 
  } = usePWALifecycle();
  const { playClickSound } = useAudio();

  const handleUpdate = () => {
    playClickSound();
    updateApp();
  };

  const handleDismiss = () => {
    playClickSound();
    dismissUpdate();
  };

  if (!updateAvailable) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-fade-in">
      <Alert className="glassmorphism border-accent/50 shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-accent/20 rounded-lg mt-1">
              <Download className="h-5 w-5 text-accent" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-semibold">Nova versão disponível!</h4>
                <Badge variant="secondary" className="text-xs">
                  v{appVersion}
                </Badge>
                <Badge 
                  variant={isOnline ? "default" : "destructive"}
                  className="text-xs flex items-center gap-1"
                >
                  {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                  {isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
              
              <AlertDescription className="text-sm mb-3">
                Uma nova versão do TranquiliMais está pronta com melhorias de performance e novas funcionalidades.
              </AlertDescription>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleUpdate}
                  disabled={!canUpdate || !isOnline}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Atualizar Agora
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDismiss}
                  disabled={isUpdating}
                >
                  Mais Tarde
                </Button>
              </div>
              
              {!isOnline && (
                <p className="text-xs text-muted-foreground mt-2">
                  Conecte-se à internet para atualizar o app
                </p>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            disabled={isUpdating}
            className="h-8 w-8 p-0 ml-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default PWAUpdateNotification;

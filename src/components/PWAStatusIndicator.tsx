
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Monitor, Wifi, WifiOff, Download } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { usePWALifecycle } from '@/hooks/usePWALifecycle';

const PWAStatusIndicator = () => {
  const { isStandalone, isInstalled } = usePWA();
  const { isOnline, updateAvailable, appVersion } = usePWALifecycle();

  if (!isInstalled && !isStandalone) return null;

  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col gap-2">
      {/* Status PWA */}
      <Badge 
        variant="secondary" 
        className="glassmorphism flex items-center gap-1"
      >
        {isStandalone ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
        <span className="text-xs">PWA v{appVersion}</span>
      </Badge>
      
      {/* Status de Conexão */}
      <Badge 
        variant={isOnline ? "default" : "destructive"}
        className="glassmorphism flex items-center gap-1"
      >
        {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        <span className="text-xs">{isOnline ? 'Online' : 'Offline'}</span>
      </Badge>
      
      {/* Indicador de Atualização Disponível */}
      {updateAvailable && (
        <Badge 
          variant="secondary"
          className="glassmorphism flex items-center gap-1 animate-pulse bg-accent/20"
        >
          <Download className="h-3 w-3 text-accent" />
          <span className="text-xs text-accent">Atualização</span>
        </Badge>
      )}
    </div>
  );
};

export default PWAStatusIndicator;

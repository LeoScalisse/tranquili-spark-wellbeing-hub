
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

const PWAStatus = () => {
  const { isStandalone, isInstalled } = usePWA();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isInstalled && !isStandalone) return null;

  return (
    <div className="fixed top-4 right-4 z-40 flex gap-2">
      <Badge 
        variant="secondary" 
        className="glassmorphism flex items-center gap-1"
      >
        {isStandalone ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
        <span className="text-xs">PWA</span>
      </Badge>
      
      <Badge 
        variant={isOnline ? "default" : "destructive"}
        className="glassmorphism flex items-center gap-1"
      >
        {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        <span className="text-xs">{isOnline ? 'Online' : 'Offline'}</span>
      </Badge>
    </div>
  );
};

export default PWAStatus;

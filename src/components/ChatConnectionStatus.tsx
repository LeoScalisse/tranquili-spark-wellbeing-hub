
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';

interface ChatConnectionStatusProps {
  isConnected: boolean;
  lastError?: string;
}

const ChatConnectionStatus = ({ isConnected, lastError }: ChatConnectionStatusProps) => {
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Mostrar status quando há problema ou nos primeiros 3 segundos
    if (!isConnected || lastError) {
      setShowStatus(true);
      
      // Se conectou, ocultar após 2 segundos
      if (isConnected && !lastError) {
        const timer = setTimeout(() => setShowStatus(false), 2000);
        return () => clearTimeout(timer);
      }
    } else {
      // Quando tudo está OK, mostrar brevemente e ocultar
      setShowStatus(true);
      const timer = setTimeout(() => setShowStatus(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, lastError]);

  if (!showStatus) return null;

  const getStatusConfig = () => {
    if (lastError) {
      return {
        icon: AlertCircle,
        text: 'Problemas de conexão',
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-300'
      };
    }
    
    if (!isConnected) {
      return {
        icon: WifiOff,
        text: 'Desconectada',
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300'
      };
    }
    
    return {
      icon: Wifi,
      text: 'Tranquilinha conectada',
      variant: 'default' as const,
      className: 'bg-green-100 text-green-800 border-green-300'
    };
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className="flex justify-center mb-2">
      <Badge variant={config.variant} className={`${config.className} flex items-center gap-2 px-3 py-1`}>
        <IconComponent className="w-3 h-3" />
        <span className="text-xs font-medium">{config.text}</span>
      </Badge>
    </div>
  );
};

export default ChatConnectionStatus;

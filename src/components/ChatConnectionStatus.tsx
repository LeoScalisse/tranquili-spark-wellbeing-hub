
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wifi, WifiOff, AlertCircle, RefreshCw } from 'lucide-react';
import { claudeService } from '@/services/claudeService';

interface ChatConnectionStatusProps {
  isConnected: boolean;
  lastError?: string;
  onRetry?: () => void;
}

const ChatConnectionStatus = ({ isConnected, lastError, onRetry }: ChatConnectionStatusProps) => {
  const [showStatus, setShowStatus] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  useEffect(() => {
    // Mostrar status quando há problema ou nos primeiros 3 segundos
    if (!isConnected || lastError) {
      setShowStatus(true);
      
      // Se conectou, ocultar após 3 segundos
      if (isConnected && !lastError) {
        const timer = setTimeout(() => setShowStatus(false), 3000);
        return () => clearTimeout(timer);
      }
    } else {
      // Quando tudo está OK, mostrar brevemente e ocultar
      setShowStatus(true);
      const timer = setTimeout(() => setShowStatus(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, lastError]);

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const result = await claudeService.testConnection();
      console.log('🔍 Teste de conexão:', result);
      
      if (result.success && onRetry) {
        onRetry();
      }
    } catch (error) {
      console.error('❌ Erro no teste de conexão:', error);
    } finally {
      setIsTestingConnection(false);
    }
  };

  if (!showStatus) return null;

  const getStatusConfig = () => {
    if (lastError) {
      return {
        icon: AlertCircle,
        text: 'Problemas de conexão',
        variant: 'destructive' as const,
        className: 'bg-red-100 text-red-800 border-red-300',
        showRetry: true
      };
    }
    
    if (!isConnected) {
      return {
        icon: WifiOff,
        text: 'Desconectada',
        variant: 'secondary' as const,
        className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        showRetry: true
      };
    }
    
    return {
      icon: Wifi,
      text: 'Tranquilinha conectada',
      variant: 'default' as const,
      className: 'bg-green-100 text-green-800 border-green-300',
      showRetry: false
    };
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className="flex justify-center mb-2">
      <div className="flex items-center gap-2">
        <Badge variant={config.variant} className={`${config.className} flex items-center gap-2 px-3 py-1`}>
          <IconComponent className="w-3 h-3" />
          <span className="text-xs font-medium">{config.text}</span>
        </Badge>
        
        {config.showRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestConnection}
            disabled={isTestingConnection}
            className="h-6 px-2 text-xs"
          >
            <RefreshCw className={`w-3 h-3 mr-1 ${isTestingConnection ? 'animate-spin' : ''}`} />
            Testar
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatConnectionStatus;

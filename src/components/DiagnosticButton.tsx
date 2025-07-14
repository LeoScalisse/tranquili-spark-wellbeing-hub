import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { claudeService } from '@/services/claudeService';
import { useAudio } from '@/contexts/AudioContext';

export const DiagnosticButton = () => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const navigate = useNavigate();
  const { playClickSound } = useAudio();

  const testConnection = async () => {
    setStatus('testing');
    playClickSound();
    
    try {
      const result = await claudeService.testConnection();
      setStatus(result.success ? 'success' : 'error');
      
      // Reset após 3 segundos
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const goToDiagnostic = () => {
    playClickSound();
    navigate('/diagnostic');
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'testing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getButtonText = () => {
    switch (status) {
      case 'testing':
        return 'Testando...';
      case 'success':
        return 'OK!';
      case 'error':
        return 'Erro';
      default:
        return 'Testar API';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={testConnection}
        disabled={status === 'testing'}
        className="glassmorphism"
      >
        {getStatusIcon()}
        <span className="ml-2 text-xs">{getButtonText()}</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={goToDiagnostic}
        className="glassmorphism"
      >
        <Settings className="h-4 w-4" />
        <span className="ml-2 text-xs hidden sm:inline">Diagnóstico</span>
      </Button>
    </div>
  );
};
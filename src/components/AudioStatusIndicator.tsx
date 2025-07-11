
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Volume2, VolumeX, AlertCircle, RefreshCw } from 'lucide-react';
import { useAudioInitialization } from '@/hooks/useAudioInitialization';
import { useAudio } from '@/contexts/AudioContext';

const AudioStatusIndicator = () => {
  const { isAudioReady, audioError, needsUserInteraction, initializeAudio, forceReinitialize } = useAudioInitialization();
  const { isSoundOn, playClickSound } = useAudio();
  const [isInitializing, setIsInitializing] = useState(false);

  const handleInitializeAudio = async () => {
    setIsInitializing(true);
    const success = await initializeAudio();
    if (success) {
      playClickSound();
    }
    setIsInitializing(false);
  };

  const handleReinitialize = async () => {
    setIsInitializing(true);
    await forceReinitialize();
    setIsInitializing(false);
  };

  if (!isSoundOn) {
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <VolumeX className="h-3 w-3" />
        Sons Desabilitados
      </Badge>
    );
  }

  if (needsUserInteraction) {
    return (
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              Ativar Áudio
            </span>
          </div>
          <p className="text-xs text-yellow-700 mb-3">
            Clique para ativar os sons relaxantes do app
          </p>
          <Button 
            size="sm" 
            onClick={handleInitializeAudio}
            disabled={isInitializing}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {isInitializing ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Ativando...
              </>
            ) : (
              <>
                <Volume2 className="h-3 w-3 mr-1" />
                Ativar Sons
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (audioError) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">
              Erro no Áudio
            </span>
          </div>
          <p className="text-xs text-red-700 mb-3">
            {audioError}
          </p>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleReinitialize}
            disabled={isInitializing}
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            {isInitializing ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Reiniciando...
              </>
            ) : (
              'Tentar Novamente'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isAudioReady) {
    return (
      <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
        <Volume2 className="h-3 w-3 mr-1" />
        Áudio Ativo
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <RefreshCw className="h-3 w-3 animate-spin" />
      Carregando Áudio...
    </Badge>
  );
};

export default AudioStatusIndicator;


import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Volume2, VolumeX, AlertCircle, RefreshCw, Smartphone, Monitor, Zap } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

const AudioStatusIndicator = () => {
  const { 
    isSoundOn, 
    isAudioReady, 
    needsUserInteraction, 
    audioError, 
    audioMethod,
    initializeAudio, 
    resetAudio, 
    testAudio,
    platformInfo,
    getAudioDebugInfo
  } = useAudio();
  
  const [isInitializing, setIsInitializing] = useState(false);
  const [showDebug, setShowDebug] = useState(false);

  const handleInitializeAudio = async () => {
    setIsInitializing(true);
    try {
      const success = await initializeAudio();
      if (success) {
        // Testar áudio após inicialização
        await testAudio();
      }
    } catch (error) {
      console.error('Erro na inicialização:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleReset = async () => {
    setIsInitializing(true);
    try {
      await resetAudio();
    } finally {
      setIsInitializing(false);
    }
  };

  const handleTest = async () => {
    setIsInitializing(true);
    try {
      await testAudio();
    } finally {
      setIsInitializing(false);
    }
  };

  // Ícone da plataforma
  const PlatformIcon = platformInfo.isPWA ? Smartphone : Monitor;
  const methodIcon = {
    'tone': '🎼',
    'webaudio': '🔊',
    'html5': '🔉',
    'fallback': '👁️'
  };

  if (!isSoundOn) {
    return (
      <Badge variant="secondary" className="flex items-center gap-2">
        <VolumeX className="h-3 w-3" />
        Sons Desabilitados
      </Badge>
    );
  }

  if (needsUserInteraction && !isAudioReady) {
    return (
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="p-2 bg-yellow-100 rounded-full">
                <PlatformIcon className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Ativar Sistema de Áudio
                </span>
              </div>
              
              <p className="text-xs text-yellow-700 mb-3 leading-relaxed">
                {platformInfo.isPWA 
                  ? '📱 Detectamos que você está no app PWA! Clique para ativar os sons relaxantes.'
                  : '🌐 Clique para ativar os sons terapêuticos e relaxantes do TranquiliMais.'
                }
              </p>
              
              <div className="flex items-center gap-2">
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
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDebug(!showDebug)}
                  className="text-xs"
                >
                  {showDebug ? 'Ocultar' : 'Debug'}
                </Button>
              </div>
            </div>
          </div>
          
          {showDebug && (
            <div className="mt-3 p-2 bg-yellow-100/50 rounded text-xs space-y-1">
              <div><strong>Plataforma:</strong> {platformInfo.isPWA ? 'PWA' : 'Web'} {platformInfo.isMobile ? 'Mobile' : 'Desktop'}</div>
              <div><strong>iOS:</strong> {platformInfo.isIOS ? 'Sim' : 'Não'}</div>
              <div><strong>Web Audio:</strong> {platformInfo.supportsWebAudio ? 'Suportado' : 'Não suportado'}</div>
              <div><strong>Requer Gesto:</strong> {platformInfo.requiresUserGesture ? 'Sim' : 'Não'}</div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (audioError) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-red-800 mb-1">
                Problema no Áudio
              </div>
              <p className="text-xs text-red-700 mb-3">
                {audioError}
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleReset}
                  disabled={isInitializing}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  {isInitializing ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Resetando...
                    </>
                  ) : (
                    'Tentar Novamente'
                  )}
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDebug(!showDebug)}
                  className="text-xs"
                >
                  {showDebug ? 'Ocultar' : 'Debug'}
                </Button>
              </div>
            </div>
          </div>
          
          {showDebug && (
            <div className="mt-3 p-2 bg-red-100/50 rounded text-xs space-y-1">
              {getAudioDebugInfo().slice(-5).map((log, index) => (
                <div key={index} className="font-mono">{log}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (isAudioReady) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-2">
          <Volume2 className="h-3 w-3" />
          <span className="hidden sm:inline">Áudio Ativo</span>
          <span className="sm:hidden">Ativo</span>
          <span className="text-xs opacity-75">
            {methodIcon[audioMethod || 'fallback']}
          </span>
        </Badge>
        
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={handleTest}
            disabled={isInitializing}
            className="h-6 px-2 text-xs"
          >
            <Zap className="h-3 w-3" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowDebug(!showDebug)}
            className="h-6 px-2 text-xs"
          >
            {showDebug ? '−' : '•••'}
          </Button>
        </div>
        
        {showDebug && (
          <Card className="absolute top-full left-0 mt-2 z-50 w-80 max-w-sm bg-white/95 backdrop-blur">
            <CardContent className="p-3">
              <div className="text-xs space-y-2">
                <div className="font-medium text-green-700 flex items-center gap-2">
                  <Volume2 className="h-3 w-3" />
                  Sistema de Áudio - Debug
                </div>
                <div className="space-y-1 text-gray-600">
                  <div><strong>Método:</strong> {audioMethod}</div>
                  <div><strong>Plataforma:</strong> {platformInfo.isPWA ? 'PWA' : 'Web'} {platformInfo.isMobile ? 'Mobile' : 'Desktop'}</div>
                  <div><strong>iOS:</strong> {platformInfo.isIOS ? 'Sim' : 'Não'}</div>
                </div>
                <div className="border-t pt-2">
                  <div className="font-medium mb-1">Logs Recentes:</div>
                  <div className="space-y-0.5 max-h-20 overflow-y-auto">
                    {getAudioDebugInfo().slice(-3).map((log, index) => (
                      <div key={index} className="text-xs font-mono text-gray-500">
                        {log.replace(/^\[\d+:\d+:\d+\]\s*/, '')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <Badge variant="secondary" className="flex items-center gap-1 animate-pulse">
      <RefreshCw className="h-3 w-3 animate-spin" />
      Carregando Áudio...
    </Badge>
  );
};

export default AudioStatusIndicator;

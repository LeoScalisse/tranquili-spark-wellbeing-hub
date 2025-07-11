
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAudio } from '@/contexts/AudioContext';
import { Volume2, VolumeX, Music, Waves, Minimize, Gem, Zap, Settings } from 'lucide-react';
import AudioStatusIndicator from './AudioStatusIndicator';

const AudioSettings = () => {
  const { 
    isSoundOn,
    toggleSound,
    soundProfile, 
    setSoundProfile,
    isAudioReady,
    audioMethod,
    platformInfo,
    playClickSound,
    playSuccessSound,
    playTransitionSound,
    playMoodSound,
    testAudio,
    getAudioDebugInfo
  } = useAudio();

  const [isTestMode, setIsTestMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const soundProfiles = [
    {
      id: 'zen' as const,
      name: 'Zen',
      icon: Music,
      description: 'Sons meditativos e harmônicos',
      color: 'text-green-600'
    },
    {
      id: 'nature' as const,
      name: 'Natureza',
      icon: Waves,
      description: 'Inspirado em elementos naturais',
      color: 'text-blue-600'
    },
    {
      id: 'minimal' as const,
      name: 'Minimal',
      icon: Minimize,
      description: 'Sons sutis e discretos',
      color: 'text-gray-600'
    },
    {
      id: 'crystals' as const,
      name: 'Cristais',
      icon: Gem,
      description: 'Frequências terapêuticas',
      color: 'text-purple-600'
    }
  ];

  const handleProfileChange = (profileId: typeof soundProfile) => {
    setSoundProfile(profileId);
    playClickSound();
  };

  const testSound = async (type: string) => {
    setIsTestMode(true);
    try {
      if (type === 'mood') {
        await playMoodSound('calm');
      } else if (type === 'success') {
        await playSuccessSound();
      } else if (type === 'transition') {
        await playTransitionSound();
      } else if (type === 'system') {
        await testAudio();
      }
    } catch (error) {
      console.error('Erro no teste de som:', error);
    }
    
    const duration = type === 'transition' ? 4500 : 2000;
    setTimeout(() => setIsTestMode(false), duration);
  };

  const getMethodInfo = () => {
    const methodInfo = {
      'tone': { name: 'Tone.js', icon: '🎼', quality: 'Premium', color: 'text-green-600' },
      'webaudio': { name: 'Web Audio', icon: '🔊', quality: 'Alta', color: 'text-blue-600' },
      'html5': { name: 'HTML5 Audio', icon: '🔉', quality: 'Básica', color: 'text-yellow-600' },
      'fallback': { name: 'Visual', icon: '👁️', quality: 'Sem Som', color: 'text-gray-600' }
    };
    
    return methodInfo[audioMethod || 'fallback'];
  };

  const methodInfo = getMethodInfo();

  return (
    <div className="space-y-4">
      {/* Indicador de Status do Áudio */}
      <AudioStatusIndicator />
      
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isSoundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            Configurações de Áudio
          </CardTitle>
          <CardDescription>
            Personalize sua experiência sonora relaxante
            {isAudioReady && (
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {methodInfo.icon} {methodInfo.name} - {methodInfo.quality}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Toggle principal */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="audio-enabled" className="text-sm font-medium">
                Sons Habilitados
              </Label>
              {platformInfo.isPWA && (
                <p className="text-xs text-muted-foreground">
                  📱 Otimizado para PWA
                </p>
              )}
            </div>
            <Switch
              id="audio-enabled"
              checked={isSoundOn}
              onCheckedChange={toggleSound}
            />
          </div>

          {isSoundOn && (
            <>
              {/* Informações do Sistema */}
              {isAudioReady && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-medium flex items-center gap-2">
                      <span className={methodInfo.color}>{methodInfo.icon}</span>
                      Sistema: {methodInfo.name}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="h-6 px-2 text-xs"
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Qualidade: {methodInfo.quality}</div>
                    <div>Plataforma: {platformInfo.isPWA ? 'PWA' : 'Web'} {platformInfo.isMobile ? 'Mobile' : 'Desktop'}</div>
                    {platformInfo.isIOS && <div>🍎 Otimização iOS ativa</div>}
                  </div>
                </div>
              )}

              {/* Perfis sonoros - só mostrar se o áudio estiver funcionando */}
              {isAudioReady && audioMethod !== 'fallback' && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Perfil Sonoro</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {soundProfiles.map((profile) => {
                      const Icon = profile.icon;
                      return (
                        <Button
                          key={profile.id}
                          variant={soundProfile === profile.id ? "default" : "outline"}
                          className="h-auto p-3 flex flex-col items-center gap-2"
                          onClick={() => handleProfileChange(profile.id)}
                        >
                          <Icon className={`h-4 w-4 ${profile.color}`} />
                          <div className="text-center">
                            <div className="font-medium text-xs">{profile.name}</div>
                            <div className="text-xs opacity-70">{profile.description}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Testes de som */}
              {isAudioReady && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Testar Sons</Label>
                  <div className="grid grid-cols-4 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testSound('mood')}
                      disabled={isTestMode}
                      className="text-xs flex flex-col gap-1 h-12"
                    >
                      <span>🧘</span>
                      <span>Calma</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testSound('success')}
                      disabled={isTestMode}
                      className="text-xs flex flex-col gap-1 h-12"
                    >
                      <span>✨</span>
                      <span>Sucesso</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testSound('transition')}
                      disabled={isTestMode}
                      className="text-xs flex flex-col gap-1 h-12"
                    >
                      <span>🌀</span>
                      <span>Transição</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => testSound('system')}
                      disabled={isTestMode}
                      className="text-xs flex flex-col gap-1 h-12"
                    >
                      <Zap className="h-3 w-3" />
                      <span>Sistema</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* Informações avançadas */}
              {showAdvanced && isAudioReady && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Informações Técnicas</Label>
                  <div className="p-3 bg-muted/30 rounded-lg text-xs space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="font-medium">Método Audio:</div>
                        <div className="text-muted-foreground">{methodInfo.name}</div>
                      </div>
                      <div>
                        <div className="font-medium">Qualidade:</div>
                        <div className="text-muted-foreground">{methodInfo.quality}</div>
                      </div>
                      <div>
                        <div className="font-medium">Web Audio API:</div>
                        <div className="text-muted-foreground">{platformInfo.supportsWebAudio ? 'Sim' : 'Não'}</div>
                      </div>
                      <div>
                        <div className="font-medium">Requer Gesto:</div>
                        <div className="text-muted-foreground">{platformInfo.requiresUserGesture ? 'Sim' : 'Não'}</div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-2">
                      <div className="font-medium mb-1">Debug Logs:</div>
                      <div className="max-h-20 overflow-y-auto space-y-0.5">
                        {getAudioDebugInfo().slice(-3).map((log, index) => (
                          <div key={index} className="font-mono text-xs text-muted-foreground">
                            {log.replace(/^\[\d+:\d+:\d+\]\s*/, '')}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Informações sobre frequências */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-xs font-medium mb-1">
                  🎵 Frequências Terapêuticas
                </div>
                <div className="text-xs text-muted-foreground">
                  Este app usa frequências solfeggio (528 Hz para cura, 396 Hz para libertação) 
                  e técnicas de áudio terapêutico para promover relaxamento e bem-estar.
                  {audioMethod === 'fallback' && (
                    <span className="block mt-1 text-yellow-600">
                      ⚠️ Feedback visual ativo - sons não disponíveis neste dispositivo.
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioSettings;

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAudio } from '@/contexts/AudioContext';
import { Volume2, VolumeX, Music, Waves, Minimize, Gem } from 'lucide-react';

const AudioSettings = () => {
  const { 
    isAudioEnabled, 
    toggleAudio, 
    soundProfile, 
    setSoundProfile,
    playClickSound,
    playSuccessSound,
    playTransitionSound,
    playMoodSound
  } = useAudio();

  const [isTestMode, setIsTestMode] = useState(false);

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

  const testSound = (type: string) => {
    setIsTestMode(true);
    if (type === 'mood') {
      playMoodSound('calm');
    } else if (type === 'success') {
      playSuccessSound();
    } else if (type === 'transition') {
      playTransitionSound();
    }
    const duration = type === 'transition' ? 4500 : 2000;
    setTimeout(() => setIsTestMode(false), duration);
  };

  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isAudioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          Configurações de Áudio
        </CardTitle>
        <CardDescription>
          Personalize sua experiência sonora relaxante
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Toggle principal */}
        <div className="flex items-center justify-between">
          <Label htmlFor="audio-enabled" className="text-sm font-medium">
            Sons Habilitados
          </Label>
          <Switch
            id="audio-enabled"
            checked={isAudioEnabled}
            onCheckedChange={toggleAudio}
          />
        </div>

        {isAudioEnabled && (
          <>
            {/* Perfis sonoros */}
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

            {/* Testes de som - ATUALIZADO */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Testar Sons</Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testSound('mood')}
                  disabled={isTestMode}
                  className="text-xs"
                >
                  🧘 Calma
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testSound('success')}
                  disabled={isTestMode}
                  className="text-xs"
                >
                  ✨ Sucesso
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testSound('transition')}
                  disabled={isTestMode}
                  className="text-xs"
                >
                  🌀 Transição
                </Button>
              </div>
            </div>

            {/* Informações sobre frequências */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="text-xs font-medium mb-1">
                🎵 Frequências Terapêuticas
              </div>
              <div className="text-xs text-muted-foreground">
                Este app usa frequências solfeggio (528 Hz para cura, 396 Hz para libertação) 
                e técnicas de áudio terapêutico para promover relaxamento e bem-estar.
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AudioSettings;

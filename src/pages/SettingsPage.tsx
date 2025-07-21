
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, Volume2 } from 'lucide-react';
import OnboardingSettings from '@/components/OnboardingSettings';
import AudioSettings from '@/components/AudioSettings';

const SettingsPage = () => {
  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Settings className="h-8 w-8" />
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Personalize sua experiência no Tranquili+
          </p>
        </div>

        <div className="grid gap-6">
          {/* Jornada Pessoal */}
          <OnboardingSettings />

          <Separator />

          {/* Configurações de Áudio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Áudio
              </CardTitle>
              <CardDescription>
                Configure os sons e efeitos sonoros do aplicativo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AudioSettings />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

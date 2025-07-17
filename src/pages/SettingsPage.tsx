import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Settings, User, Volume2, Palette, Target } from 'lucide-react';
import OnboardingSettings from '@/components/OnboardingSettings';
import AudioSettings from '@/components/AudioSettings';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  const getThemeInfo = () => {
    switch (theme) {
      case 'light':
        return { name: 'Claro', icon: '☀️', description: 'Tema claro e minimalista' };
      case 'dark':
        return { name: 'Escuro', icon: '🌙', description: 'Tema escuro para menor cansaço visual' };
      case 'tranquili':
        return { name: 'Tranquili', icon: '✨', description: 'Tema especial com gradientes relaxantes' };
      default:
        return { name: 'Claro', icon: '☀️', description: 'Tema claro e minimalista' };
    }
  };

  const themeInfo = getThemeInfo();

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

          {/* Configurações de Tema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Aparência
              </CardTitle>
              <CardDescription>
                Escolha o tema visual que mais combina com você
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Tema Atual</h4>
                  <Badge variant="secondary" className="flex items-center gap-1 w-fit mt-1">
                    <span>{themeInfo.icon}</span>
                    {themeInfo.name}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {themeInfo.description}
                  </p>
                </div>
                <Button onClick={toggleTheme} variant="outline">
                  Alterar Tema
                </Button>
              </div>
            </CardContent>
          </Card>

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
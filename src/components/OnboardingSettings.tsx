import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/hooks/useOnboarding';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Heart, Target } from 'lucide-react';
import { MENTAL_PATHS } from '@/types/onboarding';

const OnboardingSettings = () => {
  const { onboardingData, resetOnboarding, isLoading } = useOnboarding();
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();

  const handleResetOnboarding = async () => {
    setIsResetting(true);
    const success = await resetOnboarding();
    
    if (success) {
      setTimeout(() => {
        navigate('/onboarding');
      }, 1000);
    }
    setIsResetting(false);
  };

  const getMentalPathInfo = () => {
    if (!onboardingData?.mental_path) return null;
    return MENTAL_PATHS.find(path => path.id === onboardingData.mental_path);
  };

  const mentalPathInfo = getMentalPathInfo();

  if (!onboardingData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Jornada Pessoal
          </CardTitle>
          <CardDescription>
            Você ainda não completou sua jornada de apresentação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/onboarding')} className="w-full">
            Iniciar Jornada
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Sua Jornada Pessoal
        </CardTitle>
        <CardDescription>
          Informações da sua jornada personalizada no Tranquili+
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1">Nome</h4>
            <p className="font-semibold">{onboardingData.name}</p>
          </div>
          
          {mentalPathInfo && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-1">Caminho Mental</h4>
              <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                <span>{mentalPathInfo.icon}</span>
                {mentalPathInfo.title}
              </Badge>
            </div>
          )}
        </div>

        {onboardingData.personal_why && (
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-1 flex items-center gap-1">
              <Heart className="h-4 w-4" />
              Seu Porquê Pessoal
            </h4>
            <p className="text-sm bg-muted/50 p-3 rounded-lg italic">
              "{onboardingData.personal_why}"
            </p>
          </div>
        )}

        <div className="pt-4 border-t">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full" 
                disabled={isLoading || isResetting}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {isResetting ? 'Resetando...' : 'Refazer Jornada'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Refazer Jornada Pessoal</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza de que deseja refazer sua jornada de apresentação? 
                  Isso irá resetar suas informações pessoais e você passará novamente 
                  pelas etapas de personalização.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleResetOnboarding}
                  disabled={isResetting}
                >
                  {isResetting ? 'Resetando...' : 'Sim, refazer'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingSettings;
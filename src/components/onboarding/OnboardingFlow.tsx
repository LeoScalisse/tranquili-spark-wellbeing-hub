import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';
import OnboardingStep4 from './OnboardingStep4';
import OnboardingStep5 from './OnboardingStep5';
import OnboardingStep6 from './OnboardingStep6';
import { useOnboarding } from '@/hooks/useOnboarding';
import { MentalPath } from '@/types/onboarding';
import { Loader2 } from 'lucide-react';

const OnboardingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    mentalPath: '' as MentalPath,
    personalWhy: ''
  });

  const { saveOnboardingData, isLoading } = useOnboarding();
  const navigate = useNavigate();

  const handleStep1Next = () => {
    setCurrentStep(2);
  };

  const handleStep2Next = (name: string) => {
    setFormData(prev => ({ ...prev, name }));
    setCurrentStep(3);
  };

  const handleStep3Next = (mentalPath: MentalPath) => {
    setFormData(prev => ({ ...prev, mentalPath }));
    setCurrentStep(4);
  };

  const handleStep4Next = (personalWhy: string) => {
    setFormData(prev => ({ ...prev, personalWhy }));
    setCurrentStep(5);
  };

  const handleStep5Next = () => {
    setCurrentStep(6);
  };

  const handleOnboardingComplete = async () => {
    const success = await saveOnboardingData({
      name: formData.name,
      mental_path: formData.mentalPath,
      personal_why: formData.personalWhy
    });

    if (success) {
      // Pequeno delay para uma transição mais suave
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-lg text-foreground/70">Iniciando sua jornada...</p>
        </div>
      </div>
    );
  }

  switch (currentStep) {
    case 1:
      return <OnboardingStep1 onNext={handleStep1Next} />;
    case 2:
      return <OnboardingStep2 onNext={handleStep2Next} />;
    case 3:
      return <OnboardingStep3 onNext={handleStep3Next} userName={formData.name} />;
    case 4:
      return <OnboardingStep4 onNext={handleStep4Next} userName={formData.name} />;
    case 5:
      return <OnboardingStep5 onNext={handleStep5Next} userName={formData.name} />;
    case 6:
      return (
        <OnboardingStep6 
          onComplete={handleOnboardingComplete} 
          userName={formData.name}
          mentalPath={formData.mentalPath}
        />
      );
    default:
      return <OnboardingStep1 onNext={handleStep1Next} />;
  }
};

export default OnboardingFlow;
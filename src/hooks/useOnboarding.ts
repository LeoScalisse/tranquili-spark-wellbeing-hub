import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData, MentalPath } from '@/types/onboarding';
import { toast } from 'sonner';

export const useOnboarding = () => {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Verificar se o usuário já completou o onboarding
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', user.id)
        .eq('onboarding_completed', true)
        .maybeSingle();

      if (error) {
        console.error('Erro ao verificar onboarding:', error);
        return;
      }

      if (data) {
        setOnboardingData(data as OnboardingData);
        setHasCompletedOnboarding(true);
      }
    } catch (error) {
      console.error('Erro ao verificar status do onboarding:', error);
    }
  };

  const saveOnboardingData = async (data: {
    name: string;
    mental_path: MentalPath;
    personal_why: string;
  }) => {
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const onboardingPayload = {
        user_id: user.id,
        name: data.name,
        mental_path: data.mental_path,
        personal_why: data.personal_why,
        onboarding_completed: true
      };

      const { data: savedData, error } = await supabase
        .from('user_onboarding')
        .upsert(onboardingPayload, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setOnboardingData(savedData as OnboardingData);
      setHasCompletedOnboarding(true);
      toast.success('Jornada iniciada com sucesso!');
      
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados do onboarding:', error);
      toast.error('Erro ao iniciar jornada. Tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getPersonalWhy = async (): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_onboarding')
        .select('personal_why')
        .eq('user_id', user.id)
        .eq('onboarding_completed', true)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar porquê pessoal:', error);
        return null;
      }

      return data?.personal_why || null;
    } catch (error) {
      console.error('Erro ao obter porquê pessoal:', error);
      return null;
    }
  };

  const resetOnboarding = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('user_onboarding')
        .update({ onboarding_completed: false })
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setOnboardingData(null);
      setHasCompletedOnboarding(false);
      toast.success('Onboarding resetado! Você pode refazê-lo agora.');
      
      return true;
    } catch (error) {
      console.error('Erro ao resetar onboarding:', error);
      toast.error('Erro ao resetar onboarding. Tente novamente.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserName = (): string => {
    return onboardingData?.name || 'Usuário';
  };

  const getMentalPath = (): string | null => {
    return onboardingData?.mental_path || null;
  };

  return {
    onboardingData,
    hasCompletedOnboarding,
    isLoading,
    saveOnboardingData,
    getPersonalWhy,
    checkOnboardingStatus,
    resetOnboarding,
    getUserName,
    getMentalPath
  };
};
-- Criar tabela para dados de onboarding do usuário
CREATE TABLE public.user_onboarding (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  mental_path TEXT NOT NULL CHECK (mental_path IN ('paz_interna', 'foco_clareza', 'autoconfianca', 'conexao_relacoes')),
  personal_why TEXT NOT NULL,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.user_onboarding ENABLE ROW LEVEL SECURITY;

-- Criar políticas para acesso do usuário
CREATE POLICY "Users can view own onboarding data" 
ON public.user_onboarding 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding data" 
ON public.user_onboarding 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding data" 
ON public.user_onboarding 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Criar trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_user_onboarding_updated_at
  BEFORE UPDATE ON public.user_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Adicionar índice para performance
CREATE INDEX idx_user_onboarding_user_id ON public.user_onboarding(user_id);
CREATE INDEX idx_user_onboarding_completed ON public.user_onboarding(onboarding_completed);
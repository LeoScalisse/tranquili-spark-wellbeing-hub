
-- Primeiro, vamos corrigir as foreign keys entre as tabelas
-- Garantir que user_progress referencia profiles corretamente
ALTER TABLE public.user_progress 
DROP CONSTRAINT IF EXISTS user_progress_user_id_fkey;

ALTER TABLE public.user_progress 
ADD CONSTRAINT user_progress_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Garantir que mood_entries referencia profiles corretamente
ALTER TABLE public.mood_entries 
DROP CONSTRAINT IF EXISTS mood_entries_user_id_fkey;

ALTER TABLE public.mood_entries 
ADD CONSTRAINT mood_entries_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Garantir que user_achievements referencia profiles corretamente
ALTER TABLE public.user_achievements 
DROP CONSTRAINT IF EXISTS user_achievements_user_id_fkey;

ALTER TABLE public.user_achievements 
ADD CONSTRAINT user_achievements_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Garantir que game_progress referencia profiles corretamente
ALTER TABLE public.game_progress 
DROP CONSTRAINT IF EXISTS game_progress_user_id_fkey;

ALTER TABLE public.game_progress 
ADD CONSTRAINT game_progress_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Atualizar a função handle_new_user para garantir que cria user_progress
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Primeiro criar o profile
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'User'),
    new.email
  );
  
  -- Depois criar o user_progress
  INSERT INTO public.user_progress (user_id, level, xp, streak)
  VALUES (new.id, 1, 0, 0);
  
  RETURN new;
EXCEPTION 
  WHEN OTHERS THEN
    -- Log do erro mas não bloqueia o signup
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN new;
END;
$$;

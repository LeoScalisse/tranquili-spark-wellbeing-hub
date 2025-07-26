-- Fix database function security issues and add missing RLS DELETE policies

-- Fix handle_new_user function with proper security settings
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = ''
AS $function$
BEGIN
  -- Create the profile first
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', 'User'),
    new.email
  );
  
  -- Then create the user_progress
  INSERT INTO public.user_progress (user_id, level, xp, streak)
  VALUES (new.id, 1, 0, 0);
  
  RETURN new;
EXCEPTION 
  WHEN OTHERS THEN
    -- Log error but don't block signup
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN new;
END;
$function$;

-- Fix handle_updated_at function with proper security settings
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Add missing DELETE policies for user_progress table
CREATE POLICY "Users can delete own progress" 
ON public.user_progress 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add missing DELETE policies for user_achievements table  
CREATE POLICY "Users can delete own achievements" 
ON public.user_achievements 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add missing DELETE policies for game_progress table
CREATE POLICY "Users can delete own game progress" 
ON public.game_progress 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add missing DELETE policies for user_onboarding table
CREATE POLICY "Users can delete own onboarding data" 
ON public.user_onboarding 
FOR DELETE 
USING (auth.uid() = user_id);
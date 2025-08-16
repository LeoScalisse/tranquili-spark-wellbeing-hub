@@ .. @@
 CREATE TABLE public.user_onboarding (
   id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
-  user_id UUID NOT NULL,
+  user_id UUID NOT NULL UNIQUE,
   name TEXT NOT NULL,
   mental_path TEXT NOT NULL CHECK (mental_path IN ('paz_interna', 'foco_clareza', 'autoconfianca', 'conexao_relacoes')),
   personal_why TEXT NOT NULL,
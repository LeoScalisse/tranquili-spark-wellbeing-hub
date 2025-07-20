import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const EmailVerificationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isVerified, setIsVerified] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Verificar se foi confirmado via email
    const confirmed = searchParams.get('confirmed');
    if (confirmed === 'true') {
      setIsVerified(true);
      toast.success('Email verificado com sucesso!');
      
      setTimeout(() => {
        navigate('/onboarding', { replace: true });
      }, 2000);
      return;
    }

    // Pegar email dos parâmetros ou da sessão
    const email = searchParams.get('email');
    if (email) {
      setUserEmail(email);
    } else {
      // Tentar pegar da sessão atual
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.email) {
          setUserEmail(session.user.email);
        }
      });
    }

    // Iniciar countdown para reenvio
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [searchParams, navigate]);

  const handleResendEmail = async () => {
    if (!userEmail) {
      toast.error('Email não encontrado');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/email-verification?confirmed=true`
        }
      });

      if (error) {
        toast.error('Erro ao reenviar email');
      } else {
        toast.success('Email reenviado com sucesso!');
        setCanResend(false);
        setCountdown(60);
      }
    } catch (error) {
      toast.error('Erro inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/auth', { replace: true });
  };

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="floating-particles" style={{ top: '10%', left: '20%' }}></div>
        <div className="floating-particles" style={{ top: '20%', right: '30%' }}></div>
        <div className="floating-particles" style={{ bottom: '30%', left: '10%' }}></div>
        <div className="floating-particles" style={{ bottom: '20%', right: '20%' }}></div>
        
        <Card className="w-full max-w-md animate-fade-in glassmorphism text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500 animate-bounce" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">
              Email Verificado!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 mb-4">
              Bem-vindo ao Tranquili+! Redirecionando para seu onboarding...
            </p>
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="floating-particles" style={{ top: '10%', left: '20%' }}></div>
      <div className="floating-particles" style={{ top: '20%', right: '30%' }}></div>
      <div className="floating-particles" style={{ bottom: '30%', left: '10%' }}></div>
      <div className="floating-particles" style={{ bottom: '20%', right: '20%' }}></div>
      
      <Card className="w-full max-w-md animate-fade-in glassmorphism">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Mail className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Que sua calma e saúde mental sejam alcançadas!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6 text-center">
          <div className="space-y-3">
            <p className="text-lg font-medium text-foreground">
              Verifique seu email e comece sua jornada agora mesmo
            </p>
            
            <p className="text-sm text-foreground/70">
              Enviamos um link de verificação para:
            </p>
            
            <p className="text-sm font-medium text-primary break-all">
              {userEmail || 'seu email'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/20 border border-secondary/30">
              <p className="text-sm text-foreground/80">
                Clique no link do email para confirmar sua conta e começar sua jornada de tranquilidade no Tranquili+
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleResendEmail}
                disabled={!canResend || isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Reenviando...
                  </>
                ) : canResend ? (
                  'Reenviar Email'
                ) : (
                  `Reenviar em ${countdown}s`
                )}
              </Button>

              <Button
                onClick={handleBackToLogin}
                variant="ghost"
                className="w-full"
              >
                Voltar para Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationPage;
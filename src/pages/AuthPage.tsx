
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useAudio } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { validateEmail, validatePassword, validateName } from '@/utils/securityUtils';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { login, register } = useUser();
  const { playClickSound } = useAudio();
  const { secureLogin, secureRegister, isLoading: authLoading } = useSecureAuth();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Email validation
    if (!validateEmail(formData.email.trim())) {
      errors.email = 'Por favor, insira um e-mail válido';
    }
    
    // Password validation
    if (!isLogin) {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        errors.password = passwordValidation.errors[0];
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'As senhas não coincidem';
      }
      
      // Name validation
      const nameValidation = validateName(formData.name);
      if (!nameValidation.isValid) {
        errors.name = nameValidation.error || 'Nome inválido';
      }
    } else {
      // For login, just check if password exists
      if (formData.password.length < 8) {
        errors.password = 'A senha deve ter pelo menos 8 caracteres';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }
    
    setIsLoading(true);
    playClickSound();
    
    try {
      let result;
      
      if (isLogin) {
        result = await secureLogin(formData.email.trim(), formData.password);
      } else {
        result = await secureRegister(formData.name.trim(), formData.email.trim(), formData.password);
      }
      
      if (result.success) {
        setShowTransition(true);
        setTimeout(() => {
          navigate('/');
        }, 4000);
      } else {
        toast.error(result.error || 'Erro na autenticação');
      }
    } catch (error) {
      toast.error('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setFormErrors({});
    playClickSound();
  };

  if (showTransition) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#38b6ff' }}>
        <div className="text-center">
          <div className="text-8xl font-bold animate-zoom-in" style={{ color: '#FFDE59' }}>
            +
          </div>
        </div>
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
          <CardTitle className="text-3xl font-bold">
            Tranquili<span className="tranquili-plus">+</span>
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Entre na sua jornada de bem-estar' : 'Comece sua jornada de tranquilidade'}
          </CardDescription>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mt-2">
            <Shield className="h-4 w-4" />
            <span>Protegido com criptografia avançada</span>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                  required={!isLogin}
                  className={`glassmorphism ${formErrors.name ? 'border-red-500' : ''}`}
                />
                {formErrors.name && (
                  <p className="text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                required
                className={`glassmorphism ${formErrors.email ? 'border-red-500' : ''}`}
              />
              {formErrors.email && (
                <p className="text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Sua senha"
                  required
                  className={`glassmorphism pr-10 ${formErrors.password ? 'border-red-500' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formErrors.password && (
                <p className="text-sm text-red-600">{formErrors.password}</p>
              )}
              {!isLogin && (
                <p className="text-xs text-muted-foreground">
                  Mínimo 8 caracteres com maiúscula, minúscula e número
                </p>
              )}
            </div>
            
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirme sua senha"
                  required={!isLogin}
                  className={`glassmorphism ${formErrors.confirmPassword ? 'border-red-500' : ''}`}
                />
                {formErrors.confirmPassword && (
                  <p className="text-sm text-red-600">{formErrors.confirmPassword}</p>
                )}
              </div>
            )}
            
            {!isLogin && (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Seus dados são protegidos com criptografia de ponta a ponta e nunca são compartilhados.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || authLoading}
            >
              {isLoading || authLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? 'Entrando...' : 'Criando conta...'}
                </>
              ) : (
                isLogin ? 'Entrar' : 'Criar Conta'
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              onClick={toggleMode}
              className="w-full"
              disabled={isLoading || authLoading}
            >
              {isLogin ? 'Não tem conta? Crie uma' : 'Já tem conta? Entre'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AuthPage;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useAudio } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { login, register } = useUser();
  const { playClickSound, playTransitionSound } = useAudio();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return email.includes('@') && email.includes('.');
  };

  const validateForm = () => {
    if (!validateEmail(formData.email)) {
      toast.error('Por favor, insira um e-mail válido');
      return false;
    }
    
    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return false;
    }
    
    if (!isLogin && formData.name.trim().length < 2) {
      toast.error('O nome deve ter pelo menos 2 caracteres');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    playClickSound();
    
    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
        if (!success) {
          toast.error('E-mail ou senha incorretos');
        }
      } else {
        success = await register(formData.name, formData.email, formData.password);
        if (!success) {
          toast.error('Este e-mail já está em uso');
        }
      }
      
      if (success) {
        setShowTransition(true);
        playTransitionSound(); // Som de harpa relaxante
        setTimeout(() => {
          navigate('/');
        }, 4000);
      }
    } catch (error) {
      toast.error('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
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
                  placeholder="Seu nome"
                  required={!isLogin}
                  className="glassmorphism"
                />
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
                className="glassmorphism"
              />
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
                  className="glassmorphism pr-10"
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
                  className="glassmorphism"
                />
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
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
            >
              {isLogin ? 'Não tem conta? Crie uma' : 'Já tem conta? Entre'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

const validateEmail = (email: string) => {
  return email.includes('@') && email.includes('.');
};

const validateForm = () => {
  if (!validateEmail(formData.email)) {
    toast.error('Por favor, insira um e-mail válido');
    return false;
  }
  
  if (formData.password.length < 6) {
    toast.error('A senha deve ter pelo menos 6 caracteres');
    return false;
  }
  
  if (!isLogin && formData.password !== formData.confirmPassword) {
    toast.error('As senhas não coincidem');
    return false;
  }
  
  if (!isLogin && formData.name.trim().length < 2) {
    toast.error('O nome deve ter pelo menos 2 caracteres');
    return false;
  }
  
  return true;
};

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};

const toggleMode = () => {
  setIsLogin(!isLogin);
  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  playClickSound();
};

export default AuthPage;

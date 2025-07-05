
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, X, Smartphone, Monitor, Zap } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { playClickSound } = useAudio();

  useEffect(() => {
    // Check if already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      if ((window.navigator as any).standalone === true) {
        setIsInstalled(true);
        return;
      }
    };

    // Check if iOS
    const checkIfIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      setIsIOS(isIOSDevice);
    };

    checkIfInstalled();
    checkIfIOS();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after a delay if not installed
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallPrompt(true);
        }
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    playClickSound();
    
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      } else {
        console.log('PWA installation dismissed');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    playClickSound();
    setShowInstallPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already installed or dismissed this session
  if (isInstalled || sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  // iOS installation instructions
  if (isIOS && showInstallPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-fade-in">
        <Card className="glassmorphism border-accent/50 shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Smartphone className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Instalar TranquiliMais</CardTitle>
                  <CardDescription className="text-sm">
                    Acesse rapidamente do seu iPhone/iPad
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Badge variant="outline" className="text-xs">1</Badge>
                <span>Toque no ícone de compartilhar</span>
                <div className="ml-auto text-xl">↗️</div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Badge variant="outline" className="text-xs">2</Badge>
                <span>Role e toque em "Adicionar à Tela de Início"</span>
                <div className="ml-auto text-xl">📱</div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Badge variant="outline" className="text-xs">3</Badge>
                <span>Confirme tocando em "Adicionar"</span>
                <div className="ml-auto text-xl">✅</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-accent/10 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-accent">
                <Zap className="h-4 w-4" />
                <span>Vantagens do app instalado:</span>
              </div>
              <ul className="mt-2 text-xs space-y-1 text-muted-foreground">
                <li>• Acesso instantâneo sem abrir o navegador</li>
                <li>• Funciona offline para recursos básicos</li>
                <li>• Experiência nativa completa</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Android/Chrome installation prompt
  if (showInstallPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 animate-fade-in">
        <Card className="glassmorphism border-accent/50 shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <Monitor className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">Instalar TranquiliMais</CardTitle>
                  <CardDescription>
                    Tenha acesso rápido direto da sua tela inicial
                  </CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="grid grid-cols-3 gap-3 mb-4 text-center text-xs">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Zap className="h-4 w-4 mx-auto mb-1 text-accent" />
                <span>Acesso Rápido</span>
              </div>
              <div className="p-2 bg-accent/10 rounded-lg">
                <Smartphone className="h-4 w-4 mx-auto mb-1 text-accent" />
                <span>App Nativo</span>
              </div>
              <div className="p-2 bg-accent/10 rounded-lg">
                <Download className="h-4 w-4 mx-auto mb-1 text-accent" />
                <span>Sem Download</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleInstallClick} className="flex-1" size="lg">
                <Download className="h-4 w-4 mr-2" />
                Instalar App
              </Button>
              <Button variant="outline" onClick={handleDismiss} size="lg">
                Mais Tarde
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;

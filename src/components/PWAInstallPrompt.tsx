
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Download, X, Smartphone, Monitor, Zap, CheckCircle, Globe } from 'lucide-react';
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
  const [showModal, setShowModal] = useState(false);
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
        if (!isInstalled && !sessionStorage.getItem('pwa-prompt-dismissed')) {
          setShowInstallPrompt(true);
          // Auto-show modal for better visibility
          setTimeout(() => setShowModal(true), 1000);
        }
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setShowModal(false);
      setDeferredPrompt(null);
    });

    // Show for iOS devices even without beforeinstallprompt
    if (isIOS && !isInstalled && !sessionStorage.getItem('pwa-prompt-dismissed')) {
      setTimeout(() => {
        setShowInstallPrompt(true);
        setTimeout(() => setShowModal(true), 2000);
      }, 3000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
    };
  }, [isInstalled, isIOS]);

  const handleInstallClick = async () => {
    playClickSound();
    
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
        setShowModal(false);
        setShowInstallPrompt(false);
      } else {
        console.log('PWA installation dismissed');
      }
      
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    playClickSound();
    setShowInstallPrompt(false);
    setShowModal(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  const handleOpenModal = () => {
    playClickSound();
    setShowModal(true);
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  // iOS Modal Content
  const IOSModalContent = () => (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Smartphone className="h-6 w-6 text-accent" />
          </div>
          <div>
            <DialogTitle className="text-xl">Instalar Tranquili+</DialogTitle>
            <DialogDescription>
              Adicione à sua tela inicial para acesso rápido
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-3 bg-accent/10 rounded-lg">
            <Zap className="h-5 w-5 mx-auto mb-1 text-accent" />
            <span>Acesso Rápido</span>
          </div>
          <div className="p-3 bg-accent/10 rounded-lg">
            <Globe className="h-5 w-5 mx-auto mb-1 text-accent" />
            <span>Funciona Offline</span>
          </div>
          <div className="p-3 bg-accent/10 rounded-lg">
            <CheckCircle className="h-5 w-5 mx-auto mb-1 text-accent" />
            <span>Experiência Nativa</span>
          </div>
        </div>
        
        <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold text-sm">Como instalar:</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm">
              <Badge variant="outline" className="text-xs font-mono">1</Badge>
              <span>Toque no botão de compartilhar</span>
              <div className="ml-auto text-lg">↗️</div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Badge variant="outline" className="text-xs font-mono">2</Badge>
              <span>Role para baixo e toque em "Adicionar à Tela de Início"</span>
              <div className="ml-auto text-lg">📱</div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Badge variant="outline" className="text-xs font-mono">3</Badge>
              <span>Confirme tocando em "Adicionar"</span>
              <div className="ml-auto text-lg">✅</div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleDismiss} variant="outline" className="flex-1">
            Entendi
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  // Android Modal Content
  const AndroidModalContent = () => (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Monitor className="h-6 w-6 text-accent" />
          </div>
          <div>
            <DialogTitle className="text-xl">Instalar Tranquili+</DialogTitle>
            <DialogDescription>
              Transforme em um app nativo com um clique
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>
      
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-3 bg-accent/10 rounded-lg">
            <Zap className="h-5 w-5 mx-auto mb-1 text-accent" />
            <span>Acesso Instantâneo</span>
          </div>
          <div className="p-3 bg-accent/10 rounded-lg">
            <Globe className="h-5 w-5 mx-auto mb-1 text-accent" />
            <span>Funciona Offline</span>
          </div>
          <div className="p-3 bg-accent/10 rounded-lg">
            <Smartphone className="h-5 w-5 mx-auto mb-1 text-accent" />
            <span>App Nativo</span>
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-accent/10 to-accent/20 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">✨ Vantagens do App Instalado:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Ícone na tela inicial do seu dispositivo</li>
            <li>• Experiência completa sem navegador</li>
            <li>• Notificações e atualizações automáticas</li>
            <li>• Funciona mesmo sem internet</li>
          </ul>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleInstallClick} className="flex-1" size="lg">
            <Download className="h-4 w-4 mr-2" />
            Instalar Agora
          </Button>
          <Button variant="outline" onClick={handleDismiss} size="lg">
            Mais Tarde
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <>
      {/* Modal Dialog */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        {isIOS ? <IOSModalContent /> : <AndroidModalContent />}
      </Dialog>

      {/* Bottom Banner (fallback) */}
      {showInstallPrompt && !showModal && (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-fade-in">
          <Card className="glassmorphism border-accent/50 shadow-2xl cursor-pointer" onClick={handleOpenModal}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    {isIOS ? <Smartphone className="h-5 w-5 text-accent" /> : <Monitor className="h-5 w-5 text-accent" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Instalar Tranquili+</h4>
                    <p className="text-xs text-muted-foreground">
                      Toque para ver como instalar
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); handleOpenModal(); }}>
                    Ver Como
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;

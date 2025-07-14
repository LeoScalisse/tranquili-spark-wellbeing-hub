import { useState } from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { claudeService } from '@/services/claudeService';
import { toast } from 'sonner';

interface DiagnosticResult {
  service: string;
  status: 'success' | 'error' | 'warning' | 'testing';
  message: string;
  responseTime?: number;
}

export default function DiagnosticPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics([]);

    const tests = [
      {
        name: 'Conexão com Tranquilinha',
        test: () => claudeService.testConnection()
      },
      {
        name: 'Geração de Flashcards',
        test: () => claudeService.generateFlashcards('Teste de conectividade')
      },
      {
        name: 'Chat Geral',
        test: () => claudeService.chatWithClaude('Olá, este é um teste de conectividade')
      },
      {
        name: 'Chat com Tranquilinha',
        test: () => claudeService.chatWithTranquilinha('Olá, este é um teste de conectividade')
      }
    ];

    for (const test of tests) {
      setDiagnostics(prev => [...prev, {
        service: test.name,
        status: 'testing',
        message: 'Testando...'
      }]);

      try {
        const startTime = Date.now();
        const result = await test.test();
        const responseTime = Date.now() - startTime;

        let status: 'success' | 'error' | 'warning' = 'success';
        let message = 'Funcionando corretamente';

        if (test.name === 'Conexão com Tranquilinha') {
          if (typeof result === 'object' && result !== null && 'success' in result) {
            status = result.success ? 'success' : 'error';
            message = result.message;
          } else {
            status = 'error';
            message = 'Resposta inválida do teste de conexão';
          }
        } else if (test.name === 'Geração de Flashcards') {
          if (Array.isArray(result) && result.length > 0) {
            if (result[0].front.includes('Erro')) {
              status = 'error';
              message = result[0].back;
            } else {
              message = `${result.length} flashcards gerados com sucesso`;
            }
          } else {
            status = 'error';
            message = 'Nenhum flashcard foi gerado';
          }
        } else {
          if (typeof result === 'string') {
            if (result.includes('Erro') || result.includes('erro') || result.includes('Desculpe')) {
              status = 'error';
              message = result;
            } else {
              message = 'Resposta recebida com sucesso';
            }
          } else {
            status = 'error';
            message = 'Resposta inválida';
          }
        }

        setDiagnostics(prev => prev.map(d => 
          d.service === test.name 
            ? { ...d, status, message, responseTime }
            : d
        ));
      } catch (error) {
        console.error(`Erro no teste ${test.name}:`, error);
        setDiagnostics(prev => prev.map(d => 
          d.service === test.name 
            ? { 
                ...d, 
                status: 'error', 
                message: error.message || 'Erro desconhecido',
                responseTime: Date.now() - Date.now()
              }
            : d
        ));
      }

      // Pequena pausa entre testes
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
    
    const hasErrors = diagnostics.some(d => d.status === 'error');
    if (hasErrors) {
      toast.error('Alguns testes falharam. Verifique os resultados abaixo.');
    } else {
      toast.success('Todos os testes passaram com sucesso!');
    }
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'testing':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    }
  };

  const getStatusBadge = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Sucesso</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Aviso</Badge>;
      case 'testing':
        return <Badge variant="outline">Testando...</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">
              Diagnóstico do Sistema
            </h1>
            <p className="text-muted-foreground">
              Teste a conectividade e funcionamento das APIs do aplicativo
            </p>
            
            <Button 
              onClick={runDiagnostics}
              disabled={isRunning}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Executando Testes...
                </>
              ) : (
                'Executar Diagnóstico'
              )}
            </Button>
          </div>

          {diagnostics.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Resultados</h2>
              
              {diagnostics.map((diagnostic, index) => (
                <Card key={index} className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(diagnostic.status)}
                        <span className="text-foreground">{diagnostic.service}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {diagnostic.responseTime && (
                          <span className="text-sm text-muted-foreground">
                            {diagnostic.responseTime}ms
                          </span>
                        )}
                        {getStatusBadge(diagnostic.status)}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{diagnostic.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Sobre o Diagnóstico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">
                Este diagnóstico testa as seguintes funcionalidades:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>Conexão com Tranquilinha:</strong> Testa a conectividade básica com a API</li>
                <li>• <strong>Geração de Flashcards:</strong> Verifica se a API consegue gerar flashcards educativos</li>
                <li>• <strong>Chat Geral:</strong> Testa a funcionalidade de chat geral</li>
                <li>• <strong>Chat com Tranquilinha:</strong> Verifica o assistente de bem-estar</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                Se algum teste falhar, verifique se a chave da API está configurada corretamente nos secrets do Supabase.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
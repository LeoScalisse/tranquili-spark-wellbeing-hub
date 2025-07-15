
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Mic, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useAudio } from '@/contexts/AudioContext';
import { claudeService } from '@/services/claudeService';
import { toast } from 'sonner';
import ChatConnectionStatus from '@/components/ChatConnectionStatus';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: number;
  failed?: boolean;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [lastError, setLastError] = useState<string>('');
  const [retryingMessageId, setRetryingMessageId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useUser();
  const { isSoundOn, toggleSound, startTypingSound, stopTypingSound } = useAudio();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial greeting from Tranquilinha
    const initialMessage: Message = {
      id: '1',
      sender: 'ai',
      content: `Olá, ${user?.name}! 😊 Eu sou a Tranquilinha, sua assistente de bem-estar. Estou aqui para te apoiar com qualquer coisa relacionada ao seu bem-estar emocional, mental e físico. Como posso te ajudar hoje?`,
      timestamp: Date.now()
    };
    setMessages([initialMessage]);
  }, [user?.name]);

  // Controlar som de digitação baseado no estado isTyping
  useEffect(() => {
    if (isTyping) {
      startTypingSound();
    } else {
      stopTypingSound();
    }
    return () => {
      stopTypingSound();
    };
  }, [isTyping, startTypingSound, stopTypingSound]);

  const generateAIResponse = async (userMessage: string): Promise<{ response: string; hasError: boolean }> => {
    try {
      setIsConnected(true);
      setLastError('');
      
      const response = await claudeService.chatWithTranquilinha(userMessage);
      
      // Verifica se a resposta indica erro
      const hasError = response.includes('dificuldades técnicas') || 
                      response.includes('problemas de configuração') ||
                      response.includes('sessão expirou');
      
      if (hasError) {
        setIsConnected(false);
        setLastError('Problemas na API');
      }
      
      return { response, hasError };
    } catch (error) {
      console.error('Erro ao chamar Tranquilinha:', error);
      setIsConnected(false);
      setLastError(error.message || 'Erro de conexão');
      
      return {
        response: 'Oi! Estou com dificuldades técnicas agora, mas logo estarei de volta! Lembre-se: você é mais forte do que imagina. 💪✨',
        hasError: true
      };
    }
  };

  const sendMessage = async (messageContent: string, isRetry = false, originalMessageId?: string) => {
    if (!messageContent.trim()) return;

    let userMessage: Message;

    if (isRetry && originalMessageId) {
      // Encontrar a mensagem original e atualizar
      setMessages(prev => prev.map(msg => 
        msg.id === originalMessageId 
          ? { ...msg, failed: false }
          : msg
      ));
      userMessage = messages.find(msg => msg.id === originalMessageId)!;
      setRetryingMessageId(originalMessageId);
    } else {
      // Nova mensagem
      userMessage = {
        id: Date.now().toString(),
        sender: 'user',
        content: messageContent.trim(),
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, userMessage]);
      setInputMessage('');
    }

    setIsTyping(true);

    try {
      const { response, hasError } = await generateAIResponse(userMessage.content);
      
      setIsTyping(false);
      setRetryingMessageId('');
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: response,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      if (!hasError) {
        setIsConnected(true);
        setLastError('');
      }
      
    } catch (error) {
      setIsTyping(false);
      setRetryingMessageId('');
      
      // Marcar mensagem como falhada se não é um retry
      if (!isRetry) {
        setMessages(prev => prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, failed: true }
            : msg
        ));
      }
      
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  const handleSendMessage = () => {
    sendMessage(inputMessage);
  };

  const handleRetryMessage = (messageId: string) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      sendMessage(message.content, true, messageId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMicClick = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      toast.info('Gravação de voz será implementada em breve!');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="glassmorphism h-[80vh] flex flex-col">
          <CardHeader className="flex-row items-center space-y-0 pb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1">
              <CardTitle className="flex items-center gap-2 text-yellow-400">Tranquilinha</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sua assistente de bem-estar pessoal
              </p>
            </div>
            
            <Button variant="ghost" size="icon" onClick={toggleSound}>
              {isSoundOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <ChatConnectionStatus isConnected={isConnected} lastError={lastError} />
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg relative ${
                    message.sender === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary'
                  } ${message.failed ? 'opacity-60 border-2 border-red-300' : ''}`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </p>
                      {message.failed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRetryMessage(message.id)}
                          disabled={retryingMessageId === message.id}
                          className="text-xs p-1 h-6"
                        >
                          <RefreshCw className={`h-3 w-3 mr-1 ${retryingMessageId === message.id ? 'animate-spin' : ''}`} />
                          Tentar novamente
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-secondary p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-6 border-t">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Input
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="glassmorphism"
                    maxLength={500}
                    disabled={isTyping}
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleMicClick}
                  className={`glassmorphism ${isRecording ? 'bg-red-500 text-white' : ''}`}
                  disabled={isTyping}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                {inputMessage.length}/500 caracteres
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChatPage;

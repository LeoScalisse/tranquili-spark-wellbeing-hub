import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Mic, Volume2, VolumeX } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { useAudio } from '@/contexts/AudioContext';
import { toast } from 'sonner';
interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: number;
}
const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    user
  } = useUser();
  const {
    isSoundOn,
    toggleSound,
    startTypingSound,
    stopTypingSound
  } = useAudio();
  const navigate = useNavigate();
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    // Initial greeting from Tranquilinha
    const initialMessage: Message = {
      id: '1',
      sender: 'ai',
      content: `Olá, ${user?.name}! 😊 Eu sou a Tranquilinha, sua assistente de bem-estar. Estou aqui para te ajudar com qualquer coisa relacionada ao seu bem-estar emocional, mental e físico. Como posso te apoiar hoje?`,
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
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    const lowercaseMessage = userMessage.toLowerCase();

    // Simple response system based on keywords
    if (lowercaseMessage.includes('ansiedade') || lowercaseMessage.includes('ansioso')) {
      return "Entendo que você está sentindo ansiedade. É uma experiência muito comum e você não está sozinho(a). Vamos tentar uma técnica de respiração: inspire por 4 segundos, segure por 4, expire por 6. Repita isso algumas vezes. Que tal também pensarmos no que pode estar causando essa ansiedade? 🌸";
    }
    if (lowercaseMessage.includes('triste') || lowercaseMessage.includes('tristeza')) {
      return "Sinto que você está passando por um momento difícil. A tristeza é uma emoção válida e importante. Permita-se senti-la, mas lembre-se de que é temporária. Você gostaria de conversar sobre o que está te deixando triste? Às vezes, apenas colocar em palavras já pode ajudar. 💙";
    }
    if (lowercaseMessage.includes('feliz') || lowercaseMessage.includes('alegria') || lowercaseMessage.includes('bem')) {
      return "Que alegria saber que você está bem! 😊 É maravilhoso quando conseguimos reconhecer e celebrar esses momentos positivos. O que está te deixando feliz hoje? Compartilhar alegria faz com que ela se multiplique! ✨";
    }
    if (lowercaseMessage.includes('stress') || lowercaseMessage.includes('estresse')) {
      return "O estresse pode ser muito desafiador. Primeiro, respire fundo comigo. Agora, vamos pensar em pequenas coisas que você pode fazer para aliviar essa tensão: uma caminhada de 5 minutos, ouvir sua música favorita, ou até mesmo alongar o corpo. O que soa mais atrativo para você agora? 🌿";
    }
    if (lowercaseMessage.includes('trabalho') || lowercaseMessage.includes('job')) {
      return "Questões profissionais podem ser uma grande fonte de estresse. Lembre-se de que você é muito mais do que seu trabalho. Como você tem cuidado do seu bem-estar durante a rotina profissional? É importante estabelecer limites saudáveis. 💼";
    }
    if (lowercaseMessage.includes('relacionamento') || lowercaseMessage.includes('família')) {
      return "Os relacionamentos são fundamentais para nosso bem-estar, mas também podem ser complexos. Comunicação aberta e honesta é sempre um bom caminho. Como você tem se sentido em relação aos seus relacionamentos? 💕";
    }
    if (lowercaseMessage.includes('sono') || lowercaseMessage.includes('dormir')) {
      return "O sono é fundamental para nossa saúde mental e física. Você tem mantido uma rotina de sono regular? Algumas dicas: evite telas 1 hora antes de dormir, mantenha o quarto escuro e fresco, e tente relaxar com uma leitura leve ou meditação. 😴";
    }
    if (lowercaseMessage.includes('exercício') || lowercaseMessage.includes('atividade física')) {
      return "A atividade física é um dos melhores remédios naturais para nossa mente! Não precisa ser nada intenso - uma caminhada de 10 minutos já faz diferença. Que tipo de movimento você mais gosta de fazer? 🏃‍♀️";
    }
    if (lowercaseMessage.includes('obrigado') || lowercaseMessage.includes('obrigada')) {
      return "Por nada! 😊 Fico muito feliz em poder te ajudar. Lembre-se: você é forte, capaz e merece todo o cuidado e carinho do mundo. Estou sempre aqui quando precisar! 💚";
    }

    // Default responses
    const defaultResponses = ["Interessante perspectiva! Como você se sente em relação a isso? Às vezes, explorar nossos sentimentos pode nos dar insights valiosos sobre nós mesmos. 🤔", "Obrigada por compartilhar isso comigo. Cada experiência é única e válida. O que você acha que poderia te ajudar nesta situação? 💭", "Entendo. Você gostaria de explorar esse sentimento um pouco mais? Às vezes, quando conversamos sobre nossos pensamentos, encontramos clareza. 🌟", "Essa é uma reflexão importante. Como você tem cuidado de si mesmo(a) ultimamente? Lembre-se de que o autocuidado não é egoísmo, é necessidade. 🌸"];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage.trim(),
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    try {
      const aiResponse = await generateAIResponse(userMessage.content);
      setIsTyping(false);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: aiResponse,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      setIsTyping(false);
      toast.error('Erro ao gerar resposta. Tente novamente.');
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
  return <div className="min-h-screen p-4">
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
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map(message => <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>)}
              
              {isTyping && <div className="flex justify-start">
                  <div className="bg-secondary p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{
                    animationDelay: '0.1s'
                  }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{
                    animationDelay: '0.2s'
                  }}></div>
                    </div>
                  </div>
                </div>}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-6 border-t">
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Input value={inputMessage} onChange={e => setInputMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Digite sua mensagem..." className="glassmorphism" maxLength={500} />
                </div>
                
                <Button variant="outline" size="icon" onClick={handleMicClick} className={`glassmorphism ${isRecording ? 'bg-red-500 text-white' : ''}`}>
                  <Mic className="h-4 w-4" />
                </Button>
                
                <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping} size="icon">
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
    </div>;
};
export default ChatPage;
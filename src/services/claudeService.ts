
import { supabase } from '@/integrations/supabase/client';

export interface Flashcard {
  front: string;
  back: string;
}

export interface FlashcardsResponse {
  flashcards: Flashcard[];
}

export interface ClaudeResponse {
  response: string;
}

class ClaudeService {
  async generateFlashcards(topic: string): Promise<Flashcard[]> {
    try {
      console.log('Generating flashcards for topic:', topic);
      
      const { data, error } = await supabase.functions.invoke('claude-chat', {
        body: {
          prompt: topic,
          type: 'flashcards'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Erro na função: ${error.message}`);
      }

      console.log('Claude API response:', data);

      if (data?.flashcards && Array.isArray(data.flashcards)) {
        return data.flashcards;
      }

      // Fallback em caso de resposta inválida
      return [
        {
          front: "Erro na geração",
          back: "Não foi possível gerar flashcards. Tente novamente."
        }
      ];

    } catch (error) {
      console.error('Error generating flashcards:', error);
      
      // Fallback para demonstração
      return [
        {
          front: "Erro de conexão",
          back: "Verifique sua conexão com a internet e tente novamente."
        }
      ];
    }
  }

  async chatWithClaude(message: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('claude-chat', {
        body: {
          prompt: message,
          type: 'general'
        }
      });

      if (error) {
        throw new Error(`Erro na função: ${error.message}`);
      }

      return data?.response || 'Desculpe, não consegui processar sua mensagem.';

    } catch (error) {
      console.error('Error chatting with Claude:', error);
      return 'Erro ao conectar com a Claude API. Tente novamente.';
    }
  }

  async chatWithTranquilinha(message: string): Promise<string> {
    try {
      console.log('Chatting with Tranquilinha:', message);
      
      const { data, error } = await supabase.functions.invoke('claude-chat', {
        body: {
          prompt: message,
          type: 'wellbeing-chat'
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Erro na função: ${error.message}`);
      }

      console.log('Tranquilinha response:', data);

      return data?.response || 'Desculpe, não consegui processar sua mensagem. Como posso te ajudar de outra forma? 😊';

    } catch (error) {
      console.error('Error chatting with Tranquilinha:', error);
      return 'Parece que estou com dificuldades para me conectar agora. Que tal tentarmos uma técnica de respiração enquanto isso? Inspire por 4 segundos, segure por 4, expire por 6. 🌸';
    }
  }
}

export const claudeService = new ClaudeService();

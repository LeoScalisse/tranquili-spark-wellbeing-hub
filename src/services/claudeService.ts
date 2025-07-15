
import { supabase } from '@/integrations/supabase/client';
import { apiHealthChecker } from '@/utils/apiHealthCheck';

export interface Flashcard {
  front: string;
  back: string;
}

export interface FlashcardsResponse {
  flashcards: Flashcard[];
}

export interface ClaudeResponse {
  response: string;
  error?: string;
  debug?: any;
}

class ClaudeService {
  private async callClaudeFunction(body: any, retries = 3): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🚀 Chamando Claude API - Tentativa ${attempt}/${retries}`);
        
        const { data, error } = await supabase.functions.invoke('claude-chat', {
          body,
        });

        if (error) {
          console.error(`❌ Erro Supabase (tentativa ${attempt}):`, error);
          
          // Se é erro de autenticação, não tentar novamente
          if (error.message?.includes('JWT') || 
              error.message?.includes('unauthorized') || 
              error.message?.includes('Invalid Refresh Token')) {
            throw new Error('Sessão expirada. Faça login novamente.');
          }
          
          // Se é a última tentativa, lançar erro
          if (attempt === retries) {
            throw new Error(`Erro de conexão: ${error.message}`);
          }
          
          // Aguardar progressivamente mais tempo entre tentativas
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }

        console.log('✅ Resposta recebida com sucesso');
        return data;

      } catch (error) {
        console.error(`🚨 Erro na tentativa ${attempt}:`, error);
        
        // Se é erro de autenticação, não tentar novamente
        if (error.message?.includes('expirada') || 
            error.message?.includes('login') ||
            error.message?.includes('JWT') ||
            error.message?.includes('unauthorized')) {
          throw error;
        }
        
        if (attempt === retries) {
          throw error;
        }
        
        // Aguardar progressivamente mais tempo entre tentativas
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }

  async generateFlashcards(topic: string): Promise<Flashcard[]> {
    try {
      console.log('📚 Gerando flashcards para:', topic);
      
      const data = await this.callClaudeFunction({
        prompt: topic,
        type: 'flashcards'
      });

      if (data?.flashcards && Array.isArray(data.flashcards)) {
        console.log(`✅ ${data.flashcards.length} flashcards gerados`);
        return data.flashcards;
      }

      console.warn('⚠️ Resposta inválida, usando fallback');
      return [
        {
          front: "Erro na geração",
          back: "Não foi possível gerar flashcards. Verifique sua conexão e tente novamente."
        }
      ];

    } catch (error) {
      console.error('❌ Erro ao gerar flashcards:', error);
      
      return [
        {
          front: "Erro de conexão",
          back: error.message || "Verifique sua conexão com a internet e tente novamente."
        }
      ];
    }
  }

  async chatWithClaude(message: string): Promise<string> {
    try {
      console.log('💬 Chat geral com Claude:', message.substring(0, 50) + '...');
      
      const data = await this.callClaudeFunction({
        prompt: message,
        type: 'general'
      });

      return data?.response || 'Desculpe, não consegui processar sua mensagem.';

    } catch (error) {
      console.error('❌ Erro no chat geral:', error);
      return error.message || 'Erro ao conectar com a Claude API. Tente novamente.';
    }
  }

  async chatWithTranquilinha(message: string): Promise<string> {
    try {
      console.log('🌸 Conversando com Tranquilinha:', message.substring(0, 50) + '...');
      
      const data = await this.callClaudeFunction({
        prompt: message,
        type: 'wellbeing-chat'
      });

      if (data?.response) {
        console.log('✅ Tranquilinha respondeu com sucesso');
        return data.response;
      }

      // Se há erro mas ainda uma resposta, usar a resposta
      if (data?.error && data?.response) {
        console.warn('⚠️ Resposta com erro:', data.error);
        return data.response;
      }

      console.warn('⚠️ Resposta vazia, usando fallback');
      return 'Oi! Parece que estou com dificuldades agora, mas estou aqui para você. Que tal compartilhar como está se sentindo? 😊';

    } catch (error) {
      console.error('❌ Erro ao conversar com Tranquilinha:', error);
      
      // Mensagens de erro mais amigáveis baseadas no tipo de erro
      if (error.message?.includes('expirada') || error.message?.includes('login')) {
        return 'Parece que sua sessão expirou. Faça login novamente para continuarmos nossa conversa! 😊';
      }
      
      if (error.message?.includes('conexão') || error.message?.includes('network')) {
        return 'Estou com dificuldades de conexão agora. Que tal tentarmos uma respiração consciente enquanto isso? Inspire por 4 segundos, segure por 4, expire por 6. 🌸';
      }
      
      return 'Oi! Estou passando por algumas dificuldades técnicas, mas logo estarei de volta! Enquanto isso, lembre-se: você é mais forte do que imagina. 💪✨';
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string; responseTime?: number }> {
    try {
      const healthStatus = await apiHealthChecker.checkApiHealth(true);
      
      if (healthStatus.isHealthy) {
        return {
          success: true,
          message: 'Conexão com Tranquilinha funcionando perfeitamente! 🌸',
          responseTime: healthStatus.responseTime
        };
      } else {
        return {
          success: false,
          message: `Problemas na conexão: ${healthStatus.error}`,
          responseTime: healthStatus.responseTime
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Erro no teste: ${error.message}`
      };
    }
  }
}

export const claudeService = new ClaudeService();

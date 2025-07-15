
import { supabase } from '@/integrations/supabase/client';

export interface ApiHealthStatus {
  isHealthy: boolean;
  responseTime?: number;
  error?: string;
  lastChecked: number;
}

class ApiHealthChecker {
  private lastHealthCheck: ApiHealthStatus | null = null;
  private checkInterval = 5 * 60 * 1000; // 5 minutos

  async checkApiHealth(forceCheck = false): Promise<ApiHealthStatus> {
    const now = Date.now();
    
    // Se temos um check recente e não é forçado, retornar o cache
    if (!forceCheck && this.lastHealthCheck && 
        (now - this.lastHealthCheck.lastChecked) < this.checkInterval) {
      return this.lastHealthCheck;
    }

    console.log('🩺 Verificando saúde da API Tranquilinha...');
    const startTime = Date.now();

    try {
      const { data, error } = await supabase.functions.invoke('claude-chat', {
        body: {
          prompt: 'Teste de conectividade',
          type: 'wellbeing-chat'
        }
      });

      const responseTime = Date.now() - startTime;

      if (error) {
        console.error('❌ Erro no health check:', error);
        this.lastHealthCheck = {
          isHealthy: false,
          responseTime,
          error: error.message,
          lastChecked: now
        };
      } else {
        console.log('✅ API saudável, tempo de resposta:', responseTime + 'ms');
        this.lastHealthCheck = {
          isHealthy: true,
          responseTime,
          lastChecked: now
        };
      }

      return this.lastHealthCheck;
    } catch (error) {
      console.error('🚨 Erro crítico no health check:', error);
      this.lastHealthCheck = {
        isHealthy: false,
        responseTime: Date.now() - startTime,
        error: error.message || 'Erro desconhecido',
        lastChecked: now
      };
      
      return this.lastHealthCheck;
    }
  }

  getLastHealthStatus(): ApiHealthStatus | null {
    return this.lastHealthCheck;
  }
}

export const apiHealthChecker = new ApiHealthChecker();

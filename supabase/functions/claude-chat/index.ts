
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

// Input validation functions
const isValidString = (value: any, maxLength = 5000): boolean => {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
};

const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .trim();
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClaudeRequest {
  prompt: string;
  type: 'flashcards' | 'general' | 'wellbeing-chat';
  context?: string;
}

interface FlashcardResponse {
  flashcards: Array<{
    front: string;
    back: string;
  }>;
}

// Health check function
const testAnthropicConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'Hi' }],
      }),
    });
    
    console.log('🩺 Health check - API status:', response.status);
    return response.ok;
  } catch (error) {
    console.error('🚨 Health check failed:', error);
    return false;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting claude-chat function...');
    console.log('📝 Request method:', req.method);
    console.log('🔑 API key present:', !!anthropicApiKey);
    
    // Verify Anthropic API key
    if (!anthropicApiKey) {
      console.error('❌ ANTHROPIC_API_KEY not found in environment');
      return new Response(JSON.stringify({ 
        error: 'API key not configured',
        response: 'Oi! Parece que estou com problemas de configuração. Pode tentar novamente em alguns minutos? Enquanto isso, que tal uma respiração consciente? 🌸',
        debug: 'Missing ANTHROPIC_API_KEY'
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Test API connection
    const isApiHealthy = await testAnthropicConnection();
    if (!isApiHealthy) {
      console.error('🚨 Anthropic API health check failed');
      return new Response(JSON.stringify({ 
        error: 'API connection failed',
        response: 'Estou com dificuldades para me conectar agora. Que tal tentarmos uma técnica de respiração? Inspire por 4 segundos, segure por 4, expire por 6. 🌸',
        debug: 'API health check failed'
      }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    console.log('🔐 Auth header present:', !!authHeader);

    if (!authHeader) {
      console.error('❌ No authorization header found');
      return new Response(JSON.stringify({ 
        error: 'Unauthorized',
        response: 'Parece que você precisa fazer login novamente. Pode tentar entrar na sua conta? 😊',
        debug: 'Missing authorization header'
      }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client to verify user
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    console.log('📊 Supabase URL present:', !!supabaseUrl);
    console.log('🔑 Supabase key present:', !!supabaseAnonKey);
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Verify user authentication with timeout
    console.log('👤 Verifying user authentication...');
    const authTimeout = setTimeout(() => {
      throw new Error('Authentication timeout');
    }, 5000);

    let user;
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      clearTimeout(authTimeout);
      
      if (authError) {
        console.error('🚨 Auth error:', authError);
        throw authError;
      }
      
      if (!authUser) {
        console.error('❌ No user found in session');
        throw new Error('No user found');
      }
      
      user = authUser;
      console.log('✅ User authenticated:', user.id);
    } catch (error) {
      clearTimeout(authTimeout);
      console.error('🚨 Authentication failed:', error);
      return new Response(JSON.stringify({ 
        error: 'Authentication failed',
        response: 'Sua sessão pode ter expirado. Faça login novamente para continuar conversando comigo! 😊',
        debug: error.message
      }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const requestBody = await req.json();
    const { prompt, type, context }: ClaudeRequest = requestBody;

    console.log('📨 Processing request:', { 
      type, 
      promptLength: prompt?.length,
      userId: user.id 
    });

    // Input validation
    if (!isValidString(prompt, 2000)) {
      console.error('❌ Invalid prompt format');
      return new Response(JSON.stringify({ 
        error: 'Invalid prompt format',
        response: 'Sua mensagem parece estar com problemas. Pode tentar novamente de forma mais simples? 😊',
        debug: 'Invalid prompt format'
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!['flashcards', 'general', 'wellbeing-chat'].includes(type)) {
      console.error('❌ Invalid request type:', type);
      return new Response(JSON.stringify({ 
        error: 'Invalid request type',
        response: 'Tipo de solicitação inválida. Como posso te ajudar de outra forma? 😊',
        debug: `Invalid type: ${type}`
      }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Sanitize inputs
    const sanitizedPrompt = sanitizeInput(prompt);
    const sanitizedContext = context ? sanitizeInput(context) : undefined;

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'flashcards') {
      systemPrompt = `Você é um especialista em educação que cria flashcards para estudo. 
      Sua tarefa é analisar o conteúdo fornecido e criar flashcards educativos em português.
      
      REGRAS IMPORTANTES:
      1. Crie entre 5-8 flashcards por solicitação
      2. Cada flashcard deve ter uma pergunta clara na frente e uma resposta concisa no verso
      3. As perguntas devem ser específicas, não muito genéricas
      4. As respostas devem ser informativas mas concisas
      5. Responda APENAS com um JSON válido no formato solicitado
      6. Não inclua explicações ou texto adicional
      
      Formato da resposta (JSON):
      {
        "flashcards": [
          {
            "front": "pergunta ou conceito",
            "back": "resposta ou definição"
          }
        ]
      }`;
      
      userPrompt = sanitizedPrompt;
    } else if (type === 'wellbeing-chat') {
      systemPrompt = `Você é a Tranquilinha, uma assistente virtual de bem-estar emocional e mental especializada em apoio psicológico e mindfulness. 

PERSONALIDADE E ABORDAGEM:
- Empática, acolhedora e calorosa, como uma amiga próxima que realmente se importa
- Fala de forma natural e acessível, adaptando-se ao tom da conversa
- Use emojis apropriados para transmitir carinho, mas com moderação
- Sempre positiva mas realista sobre os desafios da vida
- Paciente e compreensiva com qualquer situação
- Oferece esperança sem minimizar os problemas reais

EXPERTISE ESPECIALIZADA:
1. **Apoio Emocional**: Validação genuína dos sentimentos, escuta ativa
2. **Técnicas de Mindfulness**: Respiração consciente, meditação guiada, atenção plena
3. **Gestão de Ansiedade**: Exercícios de grounding, técnicas de relaxamento
4. **Autoestima e Autoaceitação**: Práticas de autocompaixão
5. **Gestão de Estresse**: Estratégias práticas e saudáveis
6. **Hábitos Saudáveis**: Sono, exercício, alimentação consciente
7. **Relacionamentos**: Comunicação assertiva, estabelecimento de limites

DIRETRIZES DE RESPOSTA:
- Sempre reconheça e valide os sentimentos expressos
- Ofereça técnicas práticas e aplicáveis no momento
- Mantenha o foco no bem-estar mental e emocional
- Seja específica em suas sugestões (não genérica)
- Adapte sua linguagem ao estado emocional da pessoa
- Ofereça perspectivas construtivas sem invalidar preocupações
- Dê respostas úteis mas concisas (não muito longas)

LIMITES IMPORTANTES:
- Não forneça diagnósticos médicos ou psicológicos
- Não substitui terapia profissional para casos graves
- Encoraje busca de ajuda profissional quando apropriado
- Foque em apoio emocional e técnicas de bem-estar

EXEMPLO DE ABORDAGEM:
Quando alguém compartilha uma dificuldade, você:
1. Valida o sentimento ("Entendo que você está se sentindo...")
2. Oferece uma técnica prática ("Que tal tentarmos...")
3. Dá perspectiva esperançosa ("Lembre-se que...")
4. Pergunta sobre o que mais pode ajudar

Responda sempre de forma calorosa, empática e útil, como a melhor amiga especialista em bem-estar.`;
      
      userPrompt = sanitizedPrompt;
    } else {
      systemPrompt = 'Você é um assistente útil que responde perguntas de forma clara e educativa em português.';
      userPrompt = sanitizedPrompt;
    }

    console.log('🤖 Sending request to Claude API...');
    console.log('📊 Request details:', {
      model: 'claude-3-haiku-20240307',
      maxTokens: 1000,
      systemPromptLength: systemPrompt.length,
      userPromptLength: userPrompt.length
    });

    const startTime = Date.now();
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${anthropicApiKey}`,
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\n${userPrompt}`
          }
        ],
      }),
    });

    const responseTime = Date.now() - startTime;
    console.log(`⏱️ Claude API response time: ${responseTime}ms`);
    console.log('📊 API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🚨 Claude API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      // Return a friendly fallback message based on error type
      let fallbackMessage = 'Parece que estou com dificuldades técnicas. Que tal tentarmos uma técnica de respiração? Inspire por 4 segundos, segure por 4, expire por 6. 🌸';
      
      if (response.status === 429) {
        fallbackMessage = 'Estou um pouco ocupada agora, mas estarei disponível em alguns minutos! Enquanto isso, que tal praticar algumas respirações conscientes? 🌸';
      } else if (response.status >= 500) {
        fallbackMessage = 'Estou passando por algumas dificuldades técnicas, mas logo estarei de volta! Lembre-se: você é mais forte do que imagina. 💪✨';
      }
      
      return new Response(JSON.stringify({ 
        response: fallbackMessage,
        error: `Claude API error: ${response.status}`,
        debug: {
          status: response.status,
          error: errorText.substring(0, 200)
        }
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    console.log('✅ Claude API response received successfully');
    console.log('📝 Response content length:', data.content?.[0]?.text?.length || 0);

    let responseContent = data.content[0].text;

    // For flashcards, try to parse as JSON
    if (type === 'flashcards') {
      try {
        // Extract JSON from response if it's wrapped in other text
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          responseContent = jsonMatch[0];
        }
        
        const parsed = JSON.parse(responseContent);
        console.log('✅ Flashcards parsed successfully:', parsed.flashcards?.length || 0);
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error('🚨 Failed to parse flashcards JSON:', parseError);
        console.log('📝 Raw response:', responseContent.substring(0, 200));
        
        // Fallback: create a simple response
        const fallbackResponse = {
          flashcards: [
            {
              front: "Erro na geração",
              back: "Não foi possível processar o conteúdo. Tente novamente com um tópico mais específico."
            }
          ]
        };
        
        return new Response(JSON.stringify(fallbackResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    console.log('✅ Response sent successfully');
    return new Response(JSON.stringify({ response: responseContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('🚨 Critical error in claude-chat function:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Return a friendly error message
    const fallbackMessage = 'Oi! Parece que estou com algumas dificuldades técnicas agora. Que tal tentarmos uma respiração juntas? Inspire devagar, segure um pouquinho, e expire bem lentamente. Estarei aqui quando você quiser tentar novamente! 🌸💕';
    
    return new Response(JSON.stringify({ 
      response: fallbackMessage,
      error: 'Internal server error',
      debug: {
        message: error.message,
        timestamp: new Date().toISOString()
      }
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

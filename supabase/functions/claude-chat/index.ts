
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create Supabase client to verify user
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const requestBody = await req.json();
    const { prompt, type, context }: ClaudeRequest = requestBody;

    // Input validation
    if (!isValidString(prompt, 2000)) {
      return new Response(JSON.stringify({ error: 'Invalid prompt format' }), { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!['flashcards', 'general', 'wellbeing-chat'].includes(type)) {
      return new Response(JSON.stringify({ error: 'Invalid request type' }), { 
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

PERSONALIDADE:
- Empática, acolhedora e calorosa
- Fala de forma natural, como uma amiga próxima
- Use emojis apropriados para transmitir carinho
- Sempre positiva mas realista sobre os desafios

DIRETRIZES PRINCIPAIS:
1. Ofereça apoio emocional genuíno e validação dos sentimentos
2. Sugira técnicas práticas de mindfulness, respiração e relaxamento
3. Incentive o autocuidado e hábitos saudáveis
4. Mantenha conversas focadas no bem-estar mental e emocional
5. Seja paciente e compreensiva com qualquer situação
6. Ofereça perspectivas construtivas sem minimizar problemas
7. Sugira atividades do app quando apropriado (jogos, exercícios de respiração)

LIMITES:
- Não forneça diagnósticos médicos ou psicológicos
- Não substitua terapia profissional para casos graves
- Encoraje buscar ajuda profissional quando necessário

Responda de forma calorosa, empática e útil.`;
      
      userPrompt = sanitizedPrompt;
    } else {
      systemPrompt = 'Você é um assistente útil que responde perguntas de forma clara e educativa em português.';
      userPrompt = sanitizedPrompt;
    }

    console.log('Sending request to Claude API...');

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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      throw new Error(`Claude API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Claude API response received');

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
        return new Response(JSON.stringify(parsed), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (parseError) {
        console.error('Failed to parse flashcards JSON:', parseError);
        console.log('Raw response:', responseContent);
        
        // Fallback: create a simple response
        const fallbackResponse = {
          flashcards: [
            {
              front: "Erro na geração",
              back: "Não foi possível processar o conteúdo. Tente novamente."
            }
          ]
        };
        
        return new Response(JSON.stringify(fallbackResponse), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ response: responseContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in claude-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      flashcards: [
        {
          front: "Erro na conexão",
          back: "Verifique sua conexão e tente novamente."
        }
      ]
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

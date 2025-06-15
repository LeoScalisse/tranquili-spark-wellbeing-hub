
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

const GamesInfo = () => {
  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Sobre os TranquiliGames
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-medium mb-2">🧠 Benefícios Cognitivos</h4>
            <p className="leading-relaxed">
              Nossos jogos são projetados para exercitar diferentes aspectos da mente: 
              concentração, memória, atenção e controle cognitivo, sempre de forma relaxante.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">😌 Foco no Bem-estar</h4>
            <p className="leading-relaxed">
              Diferente de jogos tradicionais, os TranquiliGames priorizam o relaxamento 
              e a redução do stress, criando uma experiência divertiva e terapêutica.
            </p>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-accent/20">
          <h4 className="font-medium mb-2">💡 Dica de Uso</h4>
          <p className="text-sm">
            Para obter o máximo benefício, jogue por alguns minutos quando se sentir 
            estressado ou ansioso. Os jogos podem ajudar a redirecionar sua atenção 
            e promover um estado mental mais calmo.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamesInfo;

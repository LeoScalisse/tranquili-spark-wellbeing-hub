
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AchievementTipsCard = () => (
  <Card className="glassmorphism">
    <CardHeader>
      <CardTitle>Dicas para Conquistar</CardTitle>
    </CardHeader>
    
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div>
          <h4 className="font-medium text-blue-500 mb-2">💙 Humor</h4>
          <p>Registre seu humor diariamente e experimente todos os tipos disponíveis.</p>
        </div>
        <div>
          <h4 className="font-medium text-green-500 mb-2">🔥 Sequência</h4>
          <p>Mantenha uma rotina consistente de registro para construir sequências longas.</p>
        </div>
        <div>
          <h4 className="font-medium text-purple-500 mb-2">💬 Interação</h4>
          <p>Converse frequentemente com a Tranquilinha e explore funcionalidades.</p>
        </div>
        <div>
          <h4 className="font-medium text-orange-500 mb-2">🎨 Exploração</h4>
          <p>Experimente temas, visualize relatórios e configure áudio.</p>
        </div>
        <div>
          <h4 className="font-medium text-red-500 mb-2">🎮 Jogos</h4>
          <p>Jogue todos os mini-games disponíveis na Tranquili Games.</p>
        </div>
        <div>
          <h4 className="font-medium text-pink-500 mb-2">👥 Social</h4>
          <p>Use o app regularmente e desbloqueie outras conquistas.</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default AchievementTipsCard;

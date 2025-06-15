
import { ReactNode } from "react";
import { Trophy, Star, Calendar, Zap, Target, Heart, Gamepad2, Crown, BarChart3, Palette, Volume2, MessageCircle, Gift, Flame, Lock } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  category: 'mood' | 'streak' | 'interaction' | 'exploration' | 'games' | 'social';
  requirement: number;
  currentProgress?: number;
}

export const achievements: Achievement[] = [
  {
    id: 'first_mood',
    title: 'Primeiro Registro',
    description: 'Registre seu primeiro humor',
    icon: <Star className="h-6 w-6" />,
    category: 'mood',
    requirement: 1
  },
  {
    id: 'mood_week',
    title: 'Semana Completa',
    description: 'Registre seu humor por 7 dias seguidos',
    icon: <Calendar className="h-6 w-6" />,
    category: 'streak',
    requirement: 7
  },
  {
    id: 'mood_month',
    title: 'Mês Dedicado',
    description: 'Registre seu humor por 30 dias seguidos',
    icon: <Trophy className="h-6 w-6" />,
    category: 'streak',
    requirement: 30
  },
  {
    id: 'chat_start',
    title: 'Primeira Conversa',
    description: 'Inicie uma conversa com a Tranquilinha',
    icon: <Zap className="h-6 w-6" />,
    category: 'interaction',
    requirement: 1
  },
  {
    id: 'theme_explorer',
    title: 'Explorador de Temas',
    description: 'Experimente todos os 3 temas visuais',
    icon: <Target className="h-6 w-6" />,
    category: 'exploration',
    requirement: 3
  },
  {
    id: 'level_5',
    title: 'Nível 5',
    description: 'Alcance o nível 5',
    icon: <Star className="h-6 w-6" />,
    category: 'mood',
    requirement: 5
  },
  {
    id: 'mood_50',
    title: 'Meio Século',
    description: 'Registre 50 humores',
    icon: <Trophy className="h-6 w-6" />,
    category: 'mood',
    requirement: 50
  },
  {
    id: 'streak_100',
    title: 'Centenário',
    description: 'Mantenha uma sequência de 100 dias',
    icon: <Trophy className="h-6 w-6" />,
    category: 'streak',
    requirement: 100
  },
  {
    id: 'mood_master',
    title: 'Mestre do Humor',
    description: 'Registre todos os 8 tipos de humor disponíveis',
    icon: <Heart className="h-6 w-6" />,
    category: 'mood',
    requirement: 8
  },
  {
    id: 'games_beginner',
    title: 'Jogador Iniciante',
    description: 'Jogue qualquer jogo da Tranquili Games pela primeira vez',
    icon: <Gamepad2 className="h-6 w-6" />,
    category: 'games',
    requirement: 1
  },
  {
    id: 'games_enthusiast',
    title: 'Entusiasta dos Jogos',
    description: 'Jogue todos os jogos disponíveis pelo menos uma vez',
    icon: <Crown className="h-6 w-6" />,
    category: 'games',
    requirement: 2
  },
  {
    id: 'report_viewer',
    title: 'Analista de Bem-estar',
    description: 'Visualize seu relatório de humor pela primeira vez',
    icon: <BarChart3 className="h-6 w-6" />,
    category: 'exploration',
    requirement: 1
  },
  {
    id: 'audio_explorer',
    title: 'Maestro dos Sons',
    description: 'Experimente diferentes configurações de áudio',
    icon: <Volume2 className="h-6 w-6" />,
    category: 'exploration',
    requirement: 1
  },
  {
    id: 'chat_conversationalist',
    title: 'Conversador Dedicado',
    description: 'Tenha 10 conversas diferentes com a Tranquilinha',
    icon: <MessageCircle className="h-6 w-6" />,
    category: 'interaction',
    requirement: 10
  },
  {
    id: 'daily_warrior',
    title: 'Guerreiro Diário',
    description: 'Complete uma sequência de 14 dias registrando humor',
    icon: <Flame className="h-6 w-6" />,
    category: 'streak',
    requirement: 14
  },
  {
    id: 'theme_designer',
    title: 'Designer de Temas',
    description: 'Altere entre temas mais de 5 vezes em uma sessão',
    icon: <Palette className="h-6 w-6" />,
    category: 'exploration',
    requirement: 5
  },
  {
    id: 'achievement_hunter',
    title: 'Caçador de Conquistas',
    description: 'Desbloqueie 5 conquistas diferentes',
    icon: <Gift className="h-6 w-6" />,
    category: 'social',
    requirement: 5
  },
  {
    id: 'tranquili_veteran',
    title: 'Veterano Tranquili',
    description: 'Use o app por 7 dias diferentes (não consecutivos)',
    icon: <Crown className="h-6 w-6" />,
    category: 'social',
    requirement: 7
  },
  {
    id: 'tranquili_first_match',
    title: 'Primeira Combinação',
    description: 'Complete sua primeira fase no TranquiliMatch+',
    icon: <Heart className="h-6 w-6" />,
    category: 'games',
    requirement: 1
  },
  {
    id: 'tranquili_zen_master',
    title: 'Mestre Zen',
    description: 'Complete sua primeira Fase Zen no TranquiliMatch+',
    icon: <Crown className="h-6 w-6" />,
    category: 'games',
    requirement: 1
  },
  {
    id: 'tranquili_marathonist',
    title: 'Maratonista Tranquilo',
    description: 'Complete 25 fases no TranquiliMatch+',
    icon: <Flame className="h-6 w-6" />,
    category: 'games',
    requirement: 25
  },
  {
    id: 'tranquili_collector',
    title: 'Colecionador de Calma',
    description: 'Colete 500 peças no TranquiliMatch+',
    icon: <Gift className="h-6 w-6" />,
    category: 'games',
    requirement: 500
  }
];

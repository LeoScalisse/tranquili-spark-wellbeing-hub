export type MentalPath = 'paz_interna' | 'foco_clareza' | 'autoconfianca' | 'conexao_relacoes';

export interface OnboardingData {
  id?: string;
  user_id?: string;
  name: string;
  mental_path: MentalPath;
  personal_why: string;
  onboarding_completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MentalPathOption {
  id: MentalPath;
  title: string;
  description: string;
  icon: string;
}

export const MENTAL_PATHS: MentalPathOption[] = [
  {
    id: 'paz_interna',
    title: 'Paz Interna',
    description: 'Quero aliviar minha ansiedade e me sentir mais presente.',
    icon: '🧘‍♀️'
  },
  {
    id: 'foco_clareza',
    title: 'Foco e Clareza',
    description: 'Preciso me organizar mentalmente e me concentrar no que importa.',
    icon: '🎯'
  },
  {
    id: 'autoconfianca',
    title: 'Autoconfiança e Energia',
    description: 'Quero parar de me sabotar e agir com coragem.',
    icon: '⚡'
  },
  {
    id: 'conexao_relacoes',
    title: 'Conexão e Relações',
    description: 'Quero me sentir mais seguro nas minhas relações e vínculos.',
    icon: '💞'
  }
];

export const MICRO_ACTIONS: Record<MentalPath, string> = {
  paz_interna: 'Vamos respirar juntos? Inspire fundo... expire com calma.',
  foco_clareza: 'Endireite sua postura. Foque no agora. Você está presente.',
  autoconfianca: 'Diga mentalmente: "Eu posso começar leve. Mas eu vou longe."',
  conexao_relacoes: 'Pense em alguém que te faz bem. Sinta essa presença.'
};
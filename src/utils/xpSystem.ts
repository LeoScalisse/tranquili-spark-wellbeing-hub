
// Sistema de XP progressivo
export const calculateXPRequirement = (level: number): number => {
  // Fórmula progressiva: cada nível requer mais XP
  // Nível 1: 100 XP, Nível 2: 150 XP, Nível 3: 225 XP, etc.
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const calculateLevelFromXP = (totalXP: number): { level: number; currentLevelXP: number; xpToNextLevel: number } => {
  let level = 1;
  let xpUsed = 0;
  
  while (true) {
    const xpRequired = calculateXPRequirement(level);
    if (xpUsed + xpRequired > totalXP) {
      break;
    }
    xpUsed += xpRequired;
    level++;
  }
  
  const currentLevelXP = totalXP - xpUsed;
  const xpToNextLevel = calculateXPRequirement(level) - currentLevelXP;
  
  return { level, currentLevelXP, xpToNextLevel };
};

export const getXPForAction = (action: string, currentLevel: number): number => {
  const baseXP = {
    mood_entry: 10,
    chat_message: 5,
    game_play: 15,
    daily_login: 20,
    streak_bonus: 25,
    achievement: 50
  };
  
  // Multiplicador baseado no nível para incentivar uso contínuo
  const levelMultiplier = 1 + (currentLevel * 0.1);
  
  return Math.floor((baseXP[action as keyof typeof baseXP] || 5) * levelMultiplier);
};

export const getLevelMedals = () => [
  { level: 1, name: "Explorador", description: "Primeiro passo na jornada", emoji: "🌱", color: "text-green-500" },
  { level: 5, name: "Aventureiro", description: "Conhecendo novos caminhos", emoji: "🌿", color: "text-blue-500" },
  { level: 10, name: "Descobridor", description: "Desbravando territórios", emoji: "🌳", color: "text-purple-500" },
  { level: 20, name: "Guardião", description: "Protegendo o bem-estar", emoji: "🛡️", color: "text-orange-500" },
  { level: 35, name: "Mestre", description: "Dominando a tranquilidade", emoji: "⭐", color: "text-yellow-500" },
  { level: 50, name: "Sábio", description: "Alcançando a maestria", emoji: "👑", color: "text-amber-500" }
];

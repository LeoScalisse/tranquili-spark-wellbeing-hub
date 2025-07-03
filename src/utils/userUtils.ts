
export const calculateLevel = (xp: number): { level: number; xpToNextLevel: number } => {
  const level = Math.floor(xp / 100) + 1;
  const xpToNextLevel = (level * 100) - xp;
  return { level, xpToNextLevel };
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
              .replace(/javascript:/gi, '')
              .trim();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

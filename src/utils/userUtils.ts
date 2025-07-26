
export const calculateLevel = (xp: number): { level: number; xpToNextLevel: number } => {
  const level = Math.floor(xp / 100) + 1;
  const xpToNextLevel = (level * 100) - xp;
  return { level, xpToNextLevel };
};

export const sanitizeInput = (input: string): string => {
  return input
    // Remove all script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: URLs
    .replace(/javascript:/gi, '')
    // Remove data: URLs that could contain scripts
    .replace(/data:(?!image\/)[^;]*;base64/gi, '')
    // Remove on* event handlers
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Remove style attributes that could contain expressions
    .replace(/\s*style\s*=\s*["'][^"']*expression\([^"']*\)["']/gi, '')
    // Remove potentially dangerous HTML tags
    .replace(/<(iframe|object|embed|form|input|textarea|select|button|link|meta|base)[^>]*>/gi, '')
    // Clean up excessive whitespace
    .trim()
    // Limit length to prevent DoS
    .substring(0, 10000);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


import DOMPurify from 'isomorphic-dompurify';

// Input sanitization and validation
export const sanitizeInput = (input: string, allowHtml = false): string => {
  if (!input) return '';
  
  // Basic XSS prevention
  const cleaned = input.trim();
  
  if (allowHtml) {
    // Use DOMPurify for HTML content
    return DOMPurify.sanitize(cleaned, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  }
  
  // For plain text, remove all HTML tags and scripts
  return cleaned
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres');
  }
  
  if (password.length > 128) {
    errors.push('A senha deve ter no máximo 128 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateName = (name: string): { isValid: boolean; error?: string } => {
  const cleanName = sanitizeInput(name);
  
  if (cleanName.length < 2) {
    return { isValid: false, error: 'O nome deve ter pelo menos 2 caracteres' };
  }
  
  if (cleanName.length > 50) {
    return { isValid: false, error: 'O nome deve ter no máximo 50 caracteres' };
  }
  
  if (!/^[a-zA-ZÀ-ÿ\s\-']+$/.test(cleanName)) {
    return { isValid: false, error: 'O nome contém caracteres inválidos' };
  }
  
  return { isValid: true };
};

// Redirect URL validation
export const validateRedirectUrl = (url: string): boolean => {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url);
    
    // Whitelist of allowed domains for redirects
    const allowedDomains = [
      window.location.hostname,
      'localhost',
      '127.0.0.1',
      // Add your production domains here
    ];
    
    // Check if protocol is HTTPS (or HTTP for localhost)
    const isSecureProtocol = urlObj.protocol === 'https:' || 
      (urlObj.protocol === 'http:' && (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1'));
    
    if (!isSecureProtocol) return false;
    
    // Check if domain is in whitelist
    return allowedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};

// Session fingerprinting for additional security
export const generateSessionFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Security fingerprint', 2, 2);
  }
  
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${screen.width}x${screen.height}`,
    canvas: canvas.toDataURL()
  };
  
  return btoa(JSON.stringify(fingerprint));
};

// Rate limiting helper
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    
    return true;
  }
  
  clear(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// Secure error handling
export const getSecureErrorMessage = (error: any): string => {
  // Map specific errors to user-friendly messages
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'E-mail ou senha incorretos',
    'Email not confirmed': 'Por favor, confirme seu e-mail antes de fazer login',
    'Too many requests': 'Muitas tentativas. Tente novamente em alguns minutos',
    'User already registered': 'Este e-mail já está em uso',
    'Weak password': 'A senha não atende aos requisitos de segurança',
    'Invalid email': 'Por favor, insira um e-mail válido'
  };
  
  if (typeof error === 'string') {
    return errorMap[error] || 'Ocorreu um erro. Tente novamente.';
  }
  
  if (error?.message) {
    return errorMap[error.message] || 'Ocorreu um erro. Tente novamente.';
  }
  
  return 'Ocorreu um erro inesperado. Tente novamente.';
};

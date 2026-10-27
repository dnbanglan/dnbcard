import { AuthUser } from '../types';

const AUTH_STORAGE_KEY = 'dnbangla_current_auth_v2';

export const ADMIN_PASSWORD = 'adminipdnb';
export const REPORTER_PASSWORD = 'posteditor';

// Allowed passwords for admin (includes defaults and common alternatives to prevent lockout)
export const VALID_ADMIN_PASSWORDS = ['adminipdnb', 'admin', 'admin123', 'dnbangla', '123456'];

// Allowed passwords for reporter
export const VALID_REPORTER_PASSWORDS = ['posteditor', 'reporter', 'reporter123', 'dnbangla', '123456'];

// Returns current stored user session if logged in; otherwise returns null so user stays on login page
export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && (parsed.role === 'admin' || parsed.role === 'reporter') && parsed.email) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse auth user', e);
  }
  return null;
}

export function saveStoredUser(user: AuthUser): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.warn('Failed to save auth user', e);
  }
}

export function clearStoredUser(): void {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to clear auth user', e);
  }
}

export function normalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  let trimmed = email.trim().toLowerCase();
  if (!trimmed.includes('@')) {
    trimmed = `${trimmed}@gmail.com`;
  }
  return trimmed;
}

export function isValidGmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const normalized = normalizeEmail(email);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(normalized);
}

export function checkAdminPassword(pass: string): boolean {
  if (!pass) return false;
  const p = pass.trim();
  return VALID_ADMIN_PASSWORDS.includes(p) || p === ADMIN_PASSWORD;
}

export function checkReporterPassword(pass: string): boolean {
  if (!pass) return false;
  const p = pass.trim();
  return VALID_REPORTER_PASSWORDS.includes(p) || p === REPORTER_PASSWORD;
}


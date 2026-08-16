// Helper for 15-day persistent session management
export const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds (1,296,000,000 ms)
export const FIFTEEN_DAYS_SEC = 15 * 24 * 60 * 60; // 15 days in seconds (1,296,000 sec)

export function setAuthSession(token: string) {
  if (typeof window === 'undefined') return;

  const expiryTimestamp = Date.now() + FIFTEEN_DAYS_MS;

  localStorage.setItem('auth_token', token);
  localStorage.setItem('auth_expiry', String(expiryTimestamp));

  document.cookie = `auth_token=${token}; path=/; max-age=${FIFTEEN_DAYS_SEC}; SameSite=Lax`;
  document.cookie = `auth_expiry=${expiryTimestamp}; path=/; max-age=${FIFTEEN_DAYS_SEC}; SameSite=Lax`;

  window.dispatchEvent(new Event('auth_state_changed'));
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_expiry');

  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  document.cookie = 'auth_expiry=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';

  window.dispatchEvent(new Event('auth_state_changed'));
}

export function isSessionExpired(): boolean {
  if (typeof window === 'undefined') return false;

  const expiry = localStorage.getItem('auth_expiry');
  if (!expiry) return false;

  return Date.now() > Number(expiry);
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  if (isSessionExpired()) {
    clearAuthSession();
    return null;
  }

  return localStorage.getItem('auth_token');
}

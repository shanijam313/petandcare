const ADMIN_AUTH_KEY = 'mp_admin_authenticated';

function readStoredAuth() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

export function isAdminAuthenticated() {
  return readStoredAuth();
}

export function setAdminAuthenticated(value: boolean) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ADMIN_AUTH_KEY, value ? 'true' : 'false');
}

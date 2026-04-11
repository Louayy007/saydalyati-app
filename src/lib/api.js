function resolveApiBase() {
  const fromEnv = import.meta.env.VITE_API_URL;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }

  // Default to same-origin to support Vite proxy in dev and reverse proxy in prod.
  return '';
}

const API_BASE = resolveApiBase();
const REQUEST_TIMEOUT_MS = 60000;
const TOKEN_KEY = 'saydalyati_auth_token';
const USER_KEY = 'saydalyati_auth_user';

function getApiBaseCandidates() {
  const candidates = [];

  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    const isLocalhost = host === 'localhost' || host === '127.0.0.1';

    // In local dev, always try same-origin first so Vite proxy can avoid CORS.
    if (isLocalhost) {
      candidates.push('');

      if (API_BASE) {
        candidates.push(API_BASE);
      }

      if (API_BASE !== 'http://localhost:5000') {
        candidates.push('http://localhost:5000');
      }

      return candidates.filter((value, index, arr) => arr.indexOf(value) === index);
    }
  }

  candidates.push(API_BASE);

  return candidates.filter((value, index, arr) => arr.indexOf(value) === index);
}

function sanitizeUserForSession(user) {
  if (!user || typeof user !== 'object') return null;

  const profile = user.profile && typeof user.profile === 'object'
    ? {
        fullName: user.profile.fullName || null,
        establishmentName: user.profile.establishmentName || null,
        establishmentType: user.profile.establishmentType || null,
        phone: user.profile.phone || null,
        wilaya: user.profile.wilaya || null,
        address: user.profile.address || null,
        avatarUrl: user.profile.avatarUrl || null,
      }
    : null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    approvalStatus: user.approvalStatus,
    profile,
  };
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthSession(token, user) {
  const safeUser = sanitizeUserForSession(user);

  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(safeUser));
  } catch {
    // If storage quota is hit, keep a tiny session object to preserve login flow.
    const minimalUser = safeUser
      ? {
          id: safeUser.id,
          email: safeUser.email,
          role: safeUser.role,
          approvalStatus: safeUser.approvalStatus,
        }
      : null;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(minimalUser));
  }
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAuthUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const { signal, ...restOptions } = options;
  const baseCandidates = getApiBaseCandidates();
  let response;
  let lastError;

  for (const base of baseCandidates) {
    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), REQUEST_TIMEOUT_MS);

    let combinedSignal = timeoutController.signal;
    if (signal) {
      const combinedController = new AbortController();
      const abortCombined = () => combinedController.abort();
      signal.addEventListener('abort', abortCombined, { once: true });
      timeoutController.signal.addEventListener('abort', abortCombined, { once: true });
      combinedSignal = combinedController.signal;
    }

    try {
      response = await fetch(`${base}${path}`, {
        ...restOptions,
        headers,
        signal: combinedSignal,
      });
      clearTimeout(timeoutId);
      lastError = null;
      break;
    } catch (error) {
      clearTimeout(timeoutId);
      lastError = error;
      continue;
    }
  }

  if (!response) {
    const timedOut = lastError?.name === 'AbortError';
    const networkError = new Error(
      timedOut
        ? 'Le serveur met trop de temps a repondre. Reessayez dans quelques secondes.'
        : 'Impossible de joindre le serveur API. Verifiez que le backend est demarre et que VITE_API_URL est correct.'
    );
    networkError.statusCode = 0;
    networkError.cause = lastError;
    throw networkError;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'API request failed');
    error.statusCode = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

const API_BASE_URL = 'https://saydalyati-app-production.up.railway.app';

const TOKEN_KEY = 'saydalyati_auth_token';
const USER_KEY = 'saydalyati_auth_user';

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

export async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const fetchOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    // Only apply default timeout if caller did not provide their own signal
    signal: options.signal ?? AbortSignal.timeout(30000),
  };

  if (token) {
    fetchOptions.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      let errorMsg = 'API request failed';
      try {
        const error = await response.json();
        errorMsg = error.message || errorMsg;
      } catch {}
      const err = new Error(errorMsg);
      err.statusCode = response.status;
      err.status = response.status;
      throw err;
    }

    return await response.json();
  } catch (error) {
    // Only convert TimeoutError (from AbortSignal.timeout) to user-friendly message
    // AbortError means the caller intentionally cancelled — let it propagate as-is
    if (error.name === 'TimeoutError') {
      throw new Error('Timeout: Serveur ne répond pas');
    }
    throw error;
  }
}
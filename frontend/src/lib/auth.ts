const TOKEN_KEY = "jobapp_token_v1";

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  try {
    window.dispatchEvent(new Event("token_changed"));
  } catch (_err) {
    // ignore
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  try {
    window.dispatchEvent(new Event("token_changed"));
  } catch (_err) {
    // ignore
  }
}

export function clearTokenAndRedirectHome() {
  clearToken();
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
}

export function isAuthed(): boolean {
  return !!getToken();
}

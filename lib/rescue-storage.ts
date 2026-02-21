/**
 * 最後に開いた「届いた応援」ページのURLを保存・取得する。
 * localStorage / sessionStorage / Cookie の3つに保存し、どれかで読めるようにする。
 */

export const STORAGE_KEY = 'rescue_last_responses_url';
const COOKIE_NAME = 'rescue_last_url';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30日（秒）

function getFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  try {
    const part = document.cookie
      .split(';')
      .map((s) => s.trim())
      .find((s) => s.startsWith(`${COOKIE_NAME}=`));
    if (!part) return null;
    const value = part.slice(COOKIE_NAME.length + 1);
    return decodeURIComponent(value) || null;
  } catch {
    return null;
  }
}

export function getLastResponsesUrl(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const fromLocal = window.localStorage.getItem(STORAGE_KEY);
    if (fromLocal) return fromLocal;
    const fromSession = window.sessionStorage.getItem(STORAGE_KEY);
    if (fromSession) return fromSession;
    return getFromCookie();
  } catch {
    return getFromCookie();
  }
}

/** 3つすべてに保存。1つ失敗しても他は試す */
export function setLastResponsesUrl(url: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, url);
  } catch (_) {}
  try {
    window.sessionStorage.setItem(STORAGE_KEY, url);
  } catch (_) {}
  try {
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(url)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  } catch (_) {}
}

export function clearLastResponsesUrl(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch (_) {}
  try {
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
  } catch (_) {}
}

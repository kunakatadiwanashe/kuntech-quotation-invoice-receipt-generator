const isClient = typeof window !== 'undefined';

export function getItem(key: string): string | null {
  if (!isClient) return null;
  return localStorage.getItem(key);
}

export function setItem(key: string, value: string): void {
  if (!isClient) return;
  localStorage.setItem(key, value);
}

export function removeItem(key: string): void {
  if (!isClient) return;
  localStorage.removeItem(key);
}


import { Injectable } from '@angular/core';

const ACCESS_TOKEN_KEY = 'qalikay.accessToken';
const REFRESH_TOKEN_KEY = 'qalikay.refreshToken';
const USER_KEY = 'qalikay.user';

@Injectable({ providedIn: 'root' })
export class TokenStorageService {
  getAccessToken(): string | null {
    return this.safeGet(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.safeGet(REFRESH_TOKEN_KEY);
  }

  getUser<T>(): T | null {
    const raw = this.safeGet(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  saveSession(accessToken: string, refreshToken: string, user: unknown): void {
    this.safeSet(ACCESS_TOKEN_KEY, accessToken);
    this.safeSet(REFRESH_TOKEN_KEY, refreshToken);
    this.safeSet(USER_KEY, JSON.stringify(user));
  }

  updateAccessToken(accessToken: string): void {
    this.safeSet(ACCESS_TOKEN_KEY, accessToken);
  }

  clear(): void {
    this.safeRemove(ACCESS_TOKEN_KEY);
    this.safeRemove(REFRESH_TOKEN_KEY);
    this.safeRemove(USER_KEY);
  }

  private safeGet(key: string): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private safeSet(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* noop */
    }
  }

  private safeRemove(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* noop */
    }
  }
}

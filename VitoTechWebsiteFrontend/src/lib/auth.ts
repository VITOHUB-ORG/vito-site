// src/lib/auth.ts
import { formDataRequest } from "./api";

export type AuthTokens = {
  access: string;
  refresh: string;
};

const ACCESS_KEY = "vt_admin_access";
const REFRESH_KEY = "vt_admin_refresh";

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function setTokens(tokens: AuthTokens): void {
  localStorage.setItem(ACCESS_KEY, tokens.access);
  localStorage.setItem(REFRESH_KEY, tokens.refresh);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export async function login(username: string, password: string): Promise<void> {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  const data = await formDataRequest<AuthTokens>("/api/auth/token/", formData, "POST");
  setTokens(data);
}
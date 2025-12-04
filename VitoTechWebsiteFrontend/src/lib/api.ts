// src/lib/api.ts
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

export type ApiError = Error & {
  status?: number;
  responseBody?: unknown;
};

function getAuthHeaders(contentType = 'application/json'): Record<string, string> {
  try {
    const token = localStorage.getItem("vt_admin_access");
    if (!token) return {};
    return {
      Authorization: `Bearer ${token}`,
      ...(contentType ? { 'Content-Type': contentType } : {})
    };
  } catch {
    return {};
  }
}

export function setAdminToken(access: string) {
  localStorage.setItem("vt_admin_access", access);
}

export function clearAdminToken() {
  localStorage.removeItem("vt_admin_access");
}

export async function request<TResponse>(
  path: string,
  options: RequestInit = {}
): Promise<TResponse> {
  const url =
    path.startsWith("http://") || path.startsWith("https://")
      ? path
      : `${API_BASE_URL}${path}`;

  // For FormData, let browser set Content-Type with boundary
  const isFormData = options.body instanceof FormData;
  const baseHeaders: HeadersInit = isFormData 
    ? getAuthHeaders('') // No Content-Type for FormData
    : getAuthHeaders();

  const extraHeaders = options.headers as HeadersInit | undefined;

  const headers: HeadersInit = extraHeaders
    ? {
        ...baseHeaders,
        ...extraHeaders,
      }
    : baseHeaders;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const rawText = await response.text();
  let data: unknown = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText) as unknown;
    } catch {
      data = rawText;
    }
  }

  if (!response.ok) {
    const error: ApiError = new Error(`API error ${response.status}`);
    error.status = response.status;
    error.responseBody = data;
    throw error;
  }

  return data as TResponse;
}

// Special function for file uploads (FormData) - PUBLIC (no auth required)
export async function formDataRequest<TResponse>(
  path: string,
  formData: FormData,
  method = 'POST'
): Promise<TResponse> {
  const url = path.startsWith("http://") || path.startsWith("https://")
    ? path
    : `${API_BASE_URL}${path}`;

  const response = await fetch(url, {
    method,
    body: formData,
    // No Authorization header for public endpoints
  });

  const rawText = await response.text();
  let data: unknown = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText) as unknown;
    } catch {
      data = rawText;
    }
  }

  if (!response.ok) {
    const error: ApiError = new Error(`API error ${response.status}`);
    error.status = response.status;
    error.responseBody = data;
    throw error;
  }

  return data as TResponse;
}

// Helper for authenticated requests (admin only)
export async function authedRequest<TResponse>(
  path: string,
  options: RequestInit = {}
): Promise<TResponse> {
  const token = localStorage.getItem("vt_admin_access");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  return request<TResponse>(path, {
    ...options,
    headers,
  });
}
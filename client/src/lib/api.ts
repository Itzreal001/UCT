const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function getAuthHeader(path: string): Promise<Record<string, string>> {
  // Don't send auth headers for auth endpoints (login/register)
  if (path.startsWith("/api/auth/")) {
    return {};
  }

  // Get token from localStorage (set during login/register)
  const token = localStorage.getItem("auth_token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  customHeaders?: Record<string, string>
): Promise<T> {
  const authHeader = await getAuthHeader(path);

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
      ...customHeaders,
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  let data: any;
  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    data = { error: await res.text() };
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed: ${res.status}`);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, headers?: Record<string, string>) => 
    request<T>("GET", path, undefined, headers),
  post: <T>(path: string, body?: unknown, headers?: Record<string, string>) => 
    request<T>("POST", path, body, headers),
  patch: <T>(path: string, body?: unknown, headers?: Record<string, string>) => 
    request<T>("PATCH", path, body, headers),
  delete: <T>(path: string, headers?: Record<string, string>) => 
    request<T>("DELETE", path, undefined, headers),
};

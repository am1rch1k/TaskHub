const API_URL =
  (import.meta.env.VITE_API_URL ?? "https://taskhub-back-end.vercel.app").replace(/\/+$/, "");

interface ErrorResponse {
  message?: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const data = (await res.json().catch(() => null)) as T | ErrorResponse | null;

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in data
        ? (data as ErrorResponse).message
        : null) || "Ошибка запроса к серверу";

    throw new Error(message);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

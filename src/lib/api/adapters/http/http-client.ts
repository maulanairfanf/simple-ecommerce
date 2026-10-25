/**
 * Shared integration seam for the future Go REST API. No UI component may call
 * fetch directly; concrete HTTP services will use this client in later milestones.
 */
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = "/api/backend";
  let token: string | undefined;
  if (typeof window !== "undefined") {
    try {
      token = (
        JSON.parse(window.sessionStorage.getItem("daily-crumb-admin-session") ?? "null") as {
          token?: string;
        } | null
      )?.token;
    } catch {
      window.sessionStorage.removeItem("daily-crumb-admin-session");
    }
  }
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message || `API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

import type { AdminAuthService } from "@/lib/api/contracts/admin-auth-service";
import { request } from "@/lib/api/adapters/http/http-client";

type LoginResponse = {
  status: number;
  data: { token: string };
  message: string;
};

type TokenClaims = { user_id?: string | number; exp?: number };

function getTokenClaims(token: string): TokenClaims {
  const payload = token.split(".")[1];
  if (!payload) throw new Error("The login response did not include a valid token.");

  try {
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(padded)) as TokenClaims;
  } catch {
    throw new Error("The login response did not include a valid token.");
  }
}

export const httpAdminAuthService: AdminAuthService = {
  async login({ username, password }) {
    const response = await request<LoginResponse>("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (response.status !== 200 || !response.data?.token) {
      throw new Error(response.message || "Sign-in failed. Try again.");
    }

    const token = response.data.token;
    const claims = getTokenClaims(token);
    if (!claims.exp) throw new Error("The login token does not include an expiration time.");

    return {
      token,
      admin: {
        id: String(claims.user_id ?? username),
        name: username,
        username,
        permissions: [],
      },
      expiresAt: new Date(claims.exp * 1000).toISOString(),
    };
  },
  async logout() {},
  async getSession() {
    return null;
  },
};

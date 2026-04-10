import { randomUUID } from "crypto";

const TOKENS: Record<string, { uid: string; email: string; expiresAt: number }> = {};

// Token expiration time (24 hours)
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000;

export const tokenAuth = {
  // Generate a simple token
  generateToken(uid: string, email: string): string {
    const token = randomUUID();
    const expiresAt = Date.now() + TOKEN_EXPIRY;

    TOKENS[token] = {
      uid,
      email,
      expiresAt,
    };

    // Clean up expired tokens periodically
    tokenAuth.cleanupExpiredTokens();

    return token;
  },

  // Verify a token
  verifyToken(token: string): { uid: string; email: string } | null {
    const data = TOKENS[token];

    if (!data) {
      return null;
    }

    if (data.expiresAt < Date.now()) {
      delete TOKENS[token];
      return null;
    }

    return { uid: data.uid, email: data.email };
  },

  // Revoke a token
  revokeToken(token: string): void {
    delete TOKENS[token];
  },

  // Cleanup expired tokens
  cleanupExpiredTokens(): void {
    const now = Date.now();
    for (const [token, data] of Object.entries(TOKENS)) {
      if (data.expiresAt < now) {
        delete TOKENS[token];
      }
    }
  },
};

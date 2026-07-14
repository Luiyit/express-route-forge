import { Request } from 'express';

/**
 * Normalized identity returned by an AuthProvider
 */
export interface AuthIdentity {
  /**
   * Provider subject / user id
   */
  id: string;

  /**
   * Normalized claims from the provider
   */
  claims?: Record<string, unknown>;

  /**
   * Raw token / object returned by the provider
   */
  raw?: unknown;
}

/**
 * Provider contract for the generic authenticate middleware
 *
 * Return null when the request is not authenticated (401 unless optional).
 * Throw to reject with 401 and the error message in the response details.
 */
export interface AuthProvider {
  authenticate(req: Request): Promise<AuthIdentity | null>;
}

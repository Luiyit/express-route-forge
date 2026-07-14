/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request } from 'express';
import {
  authenticate,
  AuthenticateOptions,
} from '../../middlewares/auth/authenticate';
import { AuthProvider, AuthIdentity } from '../../middlewares/auth/types';
import { Middleware } from '../../types';

function loadWorkOS(): any {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('@workos-inc/node').WorkOS;
  } catch {
    throw new Error(
      '[express-route-forge] Install "@workos-inc/node" to use the WorkOS adapter.',
    );
  }
}

function loadJose(): any {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('jose');
  } catch {
    throw new Error(
      '[express-route-forge] Install "jose" to verify WorkOS bearer tokens.',
    );
  }
}

export interface WorkosProviderConfig {
  apiKey: string;
  clientId: string;

  /**
   * Required to authenticate the AuthKit sealed session cookie
   */
  cookiePassword?: string;

  /**
   * Cookie holding the sealed session
   * @default 'wos-session'
   */
  cookieName?: string;
}

/**
 * Verify an AuthKit access token (JWT) against the WorkOS JWKS
 */
async function verifyWorkosJwt(
  workos: any,
  clientId: string,
  token: string,
): Promise<{ payload: Record<string, unknown> }> {
  const jose = loadJose();
  const jwksUrl: string = workos.userManagement.getJwksUrl(clientId);
  const jwks = jose.createRemoteJWKSet(new URL(jwksUrl));
  const { payload } = await jose.jwtVerify(token, jwks);
  return { payload };
}

/**
 * AuthProvider backed by WorkOS AuthKit
 *
 * Supports two request shapes:
 *  A) Authorization: Bearer <access token> (mobile / API clients),
 *     verified against the WorkOS JWKS.
 *  B) Sealed session cookie (AuthKit web sessions), authenticated with
 *     cookiePassword. Requires a cookie parser upstream (req.cookies).
 *
 * The SDK is loaded lazily: importing this module does not require
 * "@workos-inc/node", only creating the provider does.
 */
export function workosAuthProvider(cfg: WorkosProviderConfig): AuthProvider {
  const WorkOS = loadWorkOS();
  const workos = new WorkOS(cfg.apiKey, { clientId: cfg.clientId });

  return {
    async authenticate(req: Request): Promise<AuthIdentity | null> {
      /** A) Bearer access token */
      const bearer = req.headers.authorization?.split(' ')[1];
      if (bearer) {
        const { payload } = await verifyWorkosJwt(workos, cfg.clientId, bearer);
        return {
          id: payload.sub as string,
          claims: payload,
          raw: payload,
        };
      }

      /** B) Sealed session cookie */
      const sealed = (req as any).cookies?.[cfg.cookieName ?? 'wos-session'];
      if (sealed && cfg.cookiePassword) {
        const session = workos.userManagement.loadSealedSession({
          sessionData: sealed,
          cookiePassword: cfg.cookiePassword,
        });

        const result = await session.authenticate();
        if (result.authenticated) {
          return {
            id: result.user.id,
            claims: result as Record<string, unknown>,
            raw: result,
          };
        }
      }

      return null;
    },
  };
}

/**
 * WorkOS authentication middleware
 *
 * Identity is stored in res.locals.authUser (override with opts.localsKey).
 *
 * @param cfg WorkOS provider configuration
 * @param opts Middleware options
 */
export function authenticateWorkos(
  cfg: WorkosProviderConfig,
  opts: AuthenticateOptions = {},
): Middleware {
  return authenticate(workosAuthProvider(cfg), opts);
}

export default authenticateWorkos;

import { Request, Response, NextFunction } from 'express';
import { Middleware } from '../../types';
import { AuthProvider } from './types';

export interface AuthenticateOptions {
  /**
   * Key used to store the identity in res.locals
   * @default 'authUser'
   */
  localsKey?: string;

  /**
   * When true, an unauthenticated request continues without identity
   * @default false
   */
  optional?: boolean;
}

/**
 * Generic, provider-agnostic authentication middleware
 *
 * If the provider resolves an identity, it is stored in
 * res.locals[localsKey] and the request continues.
 *
 * @param provider AuthProvider implementation
 * @param opts Middleware options
 * @returns Express middleware
 */
export function authenticate(
  provider: AuthProvider,
  opts: AuthenticateOptions = {},
): Middleware {
  const key = opts.localsKey ?? 'authUser';

  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const identity = await provider.authenticate(req);

      if (!identity) {
        if (opts.optional) {
          next();
          return;
        }

        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      res.locals = { ...res.locals, [key]: identity };
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        details: { message: (error as Error).message },
      });
    }
  };
}

export default authenticate;

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request } from 'express';
import {
  authenticate,
  AuthenticateOptions,
} from '../../middlewares/auth/authenticate';
import { AuthProvider, AuthIdentity } from '../../middlewares/auth/types';
import { Middleware } from '../../types';
import { loadFirebaseAdmin } from './init';

/**
 * AuthProvider backed by firebase-admin
 *
 * firebase-admin is loaded lazily: importing this module does not require
 * the dependency, only creating the provider does.
 *
 * @param firebaseAdmin Optional firebase-admin instance (defaults to require('firebase-admin'))
 */
export function firebaseAuthProvider(firebaseAdmin?: any): AuthProvider {
  const admin = firebaseAdmin ?? loadFirebaseAdmin();

  return {
    async authenticate(req: Request): Promise<AuthIdentity | null> {
      /** { authorization: "Bearer <token>" } */
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return null;

      const decoded = await admin.auth().verifyIdToken(token);
      return { id: decoded.uid, claims: decoded, raw: decoded };
    },
  };
}

/**
 * Firebase authentication middleware (back-compat with 0.3.x)
 *
 * Keeps the decoded token in res.locals.firebaseUser, as in 0.3.x.
 * Migration from 0.3.x is the import path only:
 *   import { authenticateFirebase } from 'express-route-forge/adapters/firebase';
 *
 * @param firebaseAdmin Optional firebase-admin instance
 * @param opts Middleware options
 */
export function authenticateFirebase(
  firebaseAdmin?: any,
  opts: AuthenticateOptions = {},
): Middleware {
  return authenticate(firebaseAuthProvider(firebaseAdmin), {
    localsKey: 'firebaseUser',
    ...opts,
  });
}

export { default as initWithServiceAccount } from './init';
export type { ServiceAccountCredentials } from './init';
export default authenticateFirebase;

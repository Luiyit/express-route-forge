
import { Request, Response, NextFunction } from 'express';
import { FirebaseAuthError } from 'firebase-admin/lib/utils/error';
import admin from 'firebase-admin';
import { Middleware } from '../../types';

/**
 * Check authorization firebase header
 * authorization: "Bearer <token>"
 * 
 * If the token is valid, the Firebase user is stored in res.locals.firebaseUser
 * 
 * @param firebaseAdmin Firebase admin instance
 * @returns Firebase token middleware
 */
function authenticateFirebase(firebaseAdmin: typeof admin): Middleware {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    /** { authorization: "Bearer <token>" } */
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        details: {
          message: 'Token not found',
        },
      });

      return;
    }
  
    try {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
  
      res.locals = {
        ...res.locals,
        firebaseUser: decodedToken,
      };
  
      next();
    } catch (error) {
      const firebaseAuthError = error as FirebaseAuthError;
  
      res.status(401).json({
        success: false,
        error: 'Unauthorized',
        details: {
          message: firebaseAuthError.message,
        },
      });
    }
  };
}
  
export default authenticateFirebase;
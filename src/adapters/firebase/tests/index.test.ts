import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import authenticateFirebase, { firebaseAuthProvider } from '../index';

jest.mock('firebase-admin', () => ({
  auth: jest.fn().mockReturnThis(),
  verifyIdToken: jest.fn(),
}));

describe('authenticateFirebase (adapter)', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {},
    };
    next = jest.fn();
  });

  it('should return 401 if no token is provided', async () => {
    req.headers = { ...req.headers, authorization: '' };

    const middleware = authenticateFirebase(admin);
    await middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Unauthorized',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token verification fails', async () => {
    req.headers = { ...req.headers, authorization: 'Bearer invalid_token' };
    (admin.auth().verifyIdToken as jest.Mock).mockRejectedValue(
      new Error('Invalid token'),
    );

    const middleware = authenticateFirebase(admin);
    await middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Unauthorized',
      details: {
        message: 'Invalid token',
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should keep the decoded token in res.locals.firebaseUser (0.3.x back-compat)', async () => {
    req.headers = { ...req.headers, authorization: 'Bearer valid_token' };
    const decodedToken = { uid: '12345' };
    (admin.auth().verifyIdToken as jest.Mock).mockResolvedValue(decodedToken);

    const middleware = authenticateFirebase(admin);
    await middleware(req as Request, res as Response, next);

    expect(res.locals?.firebaseUser).toBeDefined();
    expect(res.locals?.firebaseUser).toEqual({
      id: '12345',
      claims: decodedToken,
      raw: decodedToken,
    });
    expect(next).toHaveBeenCalled();
  });

  it('firebaseAuthProvider maps the decoded token to AuthIdentity', async () => {
    const decodedToken = { uid: 'abc', email: 'a@b.c' };
    (admin.auth().verifyIdToken as jest.Mock).mockResolvedValue(decodedToken);

    const provider = firebaseAuthProvider(admin);
    const identity = await provider.authenticate({
      headers: { authorization: 'Bearer token' },
    } as Request);

    expect(identity).toEqual({
      id: 'abc',
      claims: decodedToken,
      raw: decodedToken,
    });
  });

  it('firebaseAuthProvider resolves null without a token', async () => {
    const provider = firebaseAuthProvider(admin);
    const identity = await provider.authenticate({
      headers: {},
    } as Request);

    expect(identity).toBeNull();
  });
});

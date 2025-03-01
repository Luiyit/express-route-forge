import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import authenticateFirebase from '../authenticateFirebase';

jest.mock('firebase-admin', () => ({
  auth: jest.fn().mockReturnThis(),
  verifyIdToken: jest.fn(),
}));

describe('authenticateFirebase', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {},
    };
    next = jest.fn();
  });

  it('should return 401 if no token is provided', async () => {
    req.headers = {...req.headers, authorization: ''};

    const middleware = authenticateFirebase(admin);
    await middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Unauthorized',
      details: {
        message: 'Token not found',
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token verification fails', async () => {
    req.headers = {...req.headers, authorization: 'Bearer invalid_token'};
    (admin.auth().verifyIdToken as jest.Mock).mockRejectedValue(new Error('Invalid token'));

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

  it('should call next if token is valid', async () => {
    req.headers = {...req.headers, authorization: 'Bearer valid_token'};
    const decodedToken = { uid: '12345' };
    (admin.auth().verifyIdToken as jest.Mock).mockResolvedValue(decodedToken);

    const middleware = authenticateFirebase(admin);
    await middleware(req as Request, res as Response, next);

    expect(res.locals?.firebaseUser).toBeDefined();
    expect(res.locals?.firebaseUser).toEqual(decodedToken);
    expect(next).toHaveBeenCalled();
  });
});
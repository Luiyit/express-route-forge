import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../authenticate';
import { AuthProvider } from '../types';

describe('authenticate (generic middleware)', () => {
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

  const providerWith = (identity: unknown): AuthProvider => ({
    authenticate: jest.fn().mockResolvedValue(identity),
  });

  it('stores identity in res.locals.authUser and calls next', async () => {
    const identity = { id: 'u1', claims: { role: 'admin' } };
    const middleware = authenticate(providerWith(identity));

    await middleware(req as Request, res as Response, next);

    expect(res.locals?.authUser).toEqual(identity);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('supports a custom localsKey', async () => {
    const identity = { id: 'u1' };
    const middleware = authenticate(providerWith(identity), {
      localsKey: 'currentUser',
    });

    await middleware(req as Request, res as Response, next);

    expect(res.locals?.currentUser).toEqual(identity);
    expect(next).toHaveBeenCalled();
  });

  it('returns 401 when the provider resolves null', async () => {
    const middleware = authenticate(providerWith(null));

    await middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Unauthorized',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next without identity when optional and provider resolves null', async () => {
    const middleware = authenticate(providerWith(null), { optional: true });

    await middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.locals?.authUser).toBeUndefined();
  });

  it('returns 401 with the error message when the provider throws', async () => {
    const provider: AuthProvider = {
      authenticate: jest.fn().mockRejectedValue(new Error('Invalid token')),
    };
    const middleware = authenticate(provider);

    await middleware(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: 'Unauthorized',
      details: { message: 'Invalid token' },
    });
    expect(next).not.toHaveBeenCalled();
  });
});

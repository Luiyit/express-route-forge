import { Request } from 'express';

const loadSealedSession = jest.fn();
const getJwksUrl = jest.fn().mockReturnValue('https://api.workos.com/sso/jwks/client_123');
const WorkOS = jest.fn().mockImplementation(() => ({
  userManagement: {
    loadSealedSession,
    getJwksUrl,
  },
}));

jest.mock('@workos-inc/node', () => ({ WorkOS }), { virtual: true });

const jwtVerify = jest.fn();
const createRemoteJWKSet = jest.fn().mockReturnValue('jwks');
jest.mock('jose', () => ({ jwtVerify, createRemoteJWKSet }));

import { workosAuthProvider } from '../index';

describe('workosAuthProvider', () => {
  const cfg = {
    apiKey: 'sk_test',
    clientId: 'client_123',
    cookiePassword: 'a-32-char-password-a-32-char-pass',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getJwksUrl.mockReturnValue('https://api.workos.com/sso/jwks/client_123');
  });

  it('instantiates the SDK with apiKey and clientId', () => {
    workosAuthProvider(cfg);
    expect(WorkOS).toHaveBeenCalledWith('sk_test', { clientId: 'client_123' });
  });

  it('verifies a bearer token against the JWKS and maps the payload', async () => {
    const payload = { sub: 'user_01', org_id: 'org_01' };
    jwtVerify.mockResolvedValue({ payload });

    const provider = workosAuthProvider(cfg);
    const identity = await provider.authenticate({
      headers: { authorization: 'Bearer jwt-token' },
    } as Request);

    expect(jwtVerify).toHaveBeenCalledWith('jwt-token', 'jwks');
    expect(identity).toEqual({ id: 'user_01', claims: payload, raw: payload });
  });

  it('authenticates a sealed session cookie', async () => {
    const session = {
      authenticate: jest.fn().mockResolvedValue({
        authenticated: true,
        user: { id: 'user_02' },
      }),
    };
    loadSealedSession.mockReturnValue(session);

    const provider = workosAuthProvider(cfg);
    const identity = await provider.authenticate({
      headers: {},
      cookies: { 'wos-session': 'sealed-data' },
    } as unknown as Request);

    expect(loadSealedSession).toHaveBeenCalledWith({
      sessionData: 'sealed-data',
      cookiePassword: cfg.cookiePassword,
    });
    expect(identity).toEqual(
      expect.objectContaining({ id: 'user_02' }),
    );
  });

  it('resolves null when the sealed session is not authenticated', async () => {
    const session = {
      authenticate: jest.fn().mockResolvedValue({ authenticated: false }),
    };
    loadSealedSession.mockReturnValue(session);

    const provider = workosAuthProvider(cfg);
    const identity = await provider.authenticate({
      headers: {},
      cookies: { 'wos-session': 'sealed-data' },
    } as unknown as Request);

    expect(identity).toBeNull();
  });

  it('resolves null without bearer token or session cookie', async () => {
    const provider = workosAuthProvider(cfg);
    const identity = await provider.authenticate({
      headers: {},
    } as Request);

    expect(identity).toBeNull();
  });
});

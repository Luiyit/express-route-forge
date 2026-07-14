/**
 * Dependency-graph guards: importing the package barrel (or the adapter
 * entry points) must NOT load the optional auth dependencies. They are
 * only required lazily when a provider is created.
 */

let firebaseLoaded = false;
jest.mock('firebase-admin', () => {
  firebaseLoaded = true;
  return {};
});

let workosLoaded = false;
jest.mock(
  '@workos-inc/node',
  () => {
    workosLoaded = true;
    return { WorkOS: jest.fn() };
  },
  { virtual: true },
);

describe('import graph', () => {
  it('the barrel does not load firebase-admin nor @workos-inc/node', () => {
    const barrel = require('../index');

    expect(firebaseLoaded).toBe(false);
    expect(workosLoaded).toBe(false);
    expect(typeof barrel.authenticate).toBe('function');
    expect(barrel.authenticateFirebase).toBeUndefined();
  });

  it('importing the firebase adapter does not load firebase-admin', () => {
    const adapter = require('../adapters/firebase');

    expect(firebaseLoaded).toBe(false);
    expect(typeof adapter.authenticateFirebase).toBe('function');
    expect(typeof adapter.firebaseAuthProvider).toBe('function');
  });

  it('importing the workos adapter does not load @workos-inc/node', () => {
    const adapter = require('../adapters/workos');

    expect(workosLoaded).toBe(false);
    expect(typeof adapter.workosAuthProvider).toBe('function');
    expect(typeof adapter.authenticateWorkos).toBe('function');
  });

  it('creating the firebase provider does load firebase-admin (lazy)', () => {
    const { firebaseAuthProvider } = require('../adapters/firebase');

    firebaseAuthProvider();
    expect(firebaseLoaded).toBe(true);
  });
});

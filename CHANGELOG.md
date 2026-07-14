# Changelog

## 0.4.0 (2026-07-14)

### Breaking changes

- `authenticateFirebase` is no longer exported from the package barrel.
  It now lives in the opt-in Firebase adapter:

  ```diff
  - import { authenticateFirebase } from 'express-route-forge';
  + import { authenticateFirebase } from 'express-route-forge/adapters/firebase';
  ```

  Behavior is preserved: the decoded identity is still stored in
  `res.locals.firebaseUser`. Two response details changed:
  - Missing token now responds `401 { success: false, error: 'Unauthorized' }`
    without the `details.message: 'Token not found'` field.
  - `res.locals.firebaseUser` is now a normalized `AuthIdentity`
    (`{ id, claims, raw }`) instead of the raw decoded token. The decoded
    token is available at `firebaseUser.claims` / `firebaseUser.raw`.

### Added

- Generic, provider-agnostic `authenticate(provider, opts)` middleware and the
  `AuthProvider` / `AuthIdentity` contract, exported from the barrel. Works
  with any provider implementation and has no external dependencies.
- `express-route-forge/adapters/firebase`: `firebaseAuthProvider`,
  `authenticateFirebase` (back-compat) and `initWithServiceAccount`.
  `firebase-admin` is loaded lazily — importing the adapter does not require it.
- `express-route-forge/adapters/workos`: `workosAuthProvider` and
  `authenticateWorkos` for WorkOS AuthKit (Bearer access token via JWKS, or
  sealed session cookie). `@workos-inc/node` and `jose` are loaded lazily.

### Changed

- `firebase-admin`, `joi`, `@workos-inc/node` and `jose` are now **optional**
  peer dependencies (`peerDependenciesMeta`). Installing the package without
  them produces no peer warnings; install only what your adapters need.
- Importing the package barrel no longer resolves `firebase-admin` at all.

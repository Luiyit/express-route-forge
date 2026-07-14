/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Minimal service account shape, structurally compatible with
 * firebase-admin ServiceAccount (avoids a hard type dependency)
 */
export interface ServiceAccountCredentials {
  projectId?: string;
  privateKey?: string;
  clientEmail?: string;
}

export function loadFirebaseAdmin(): any {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('firebase-admin');
  } catch {
    throw new Error(
      '[express-route-forge] Install "firebase-admin" to use the Firebase adapter.',
    );
  }
}

/**
 * Initialize the firebase-admin default app with a service account
 *
 * @param credentials Service account credentials
 * @returns firebase-admin module when the app was initialized
 */
export default function initWithServiceAccount(
  credentials: ServiceAccountCredentials,
) {
  const admin = loadFirebaseAdmin();

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: credentials.projectId,
        privateKey: (credentials.privateKey || '').replace(/\\n/g, '\n'),
        clientEmail: credentials.clientEmail,
      }),
    });

    return admin;
  }
}

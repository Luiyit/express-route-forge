import admin from 'firebase-admin';

export default function initWithServiceAccount(credentials: admin.ServiceAccount) {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: credentials.projectId,
        privateKey: (credentials.privateKey || '').replace(
          /\\n/g,
          '\n',
        ),
        clientEmail: credentials.clientEmail,
      }),
    });
    
    return admin;  
  }

}
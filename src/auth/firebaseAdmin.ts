// import * as firebase from 'firebase-admin';
// import * as serviceAccount from './serviceAccountKey.json';

// const firebase_params: firebase.ServiceAccount = {
//     type: serviceAccount.type,
//     projectId: serviceAccount.project_id,
//     privateKeyId: serviceAccount.private_key_id,
//     privateKey: serviceAccount.private_key,
//     clientEmail: serviceAccount.client_email,
//     clientId: serviceAccount.client_id,
//     authUri: serviceAccount.auth_uri,
//     tokenUri: serviceAccount.token_uri,
//     authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
//     clientC509CertUrl: serviceAccount.client_x509_cert_url
// }

// // const defaultApp = firebase.initializeApp({
// //     credential: firebase.credential.cert(firebase_params),
// //     databaseURL: "https://fir-auth-bd895.firebaseio.com"
// // });

// const defaultApp = firebase.initializeApp({
//     credential: firebase.credential.cert(serviceAccount as firebase.ServiceAccount),
//     databaseURL: 'https://fir-auth-bd895.firebaseio.com',
//   });
  

// export {
//     defaultApp
// }

// import * as firebase from 'firebase-admin';
// import serviceAccount from './serviceAccountKey.json'; // Import JSON module directly

// const defaultApp = firebase.initializeApp({
//   credential: firebase.credential.cert({
//     projectId: serviceAccount.project_id,
//     privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'), // Ensure proper formatting of the private key
//     clientEmail: serviceAccount.client_email,
//   }),
//   databaseURL: 'https://fir-auth-bd895.firebaseio.com',
// });

// export { defaultApp };


import * as firebase from 'firebase-admin';

const defaultApp = firebase.initializeApp({
  credential: firebase.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: 'https://fir-auth-bd895.firebaseio.com',
});

export { defaultApp };

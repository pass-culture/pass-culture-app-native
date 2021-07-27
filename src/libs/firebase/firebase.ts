import firebase from 'firebase/app'
import 'firebase/analytics'

import { env } from 'libs/environment'

const FIREBASE_CONFIG = {
  apiKey: env.FIREBASE_APIKEY,
  authDomain: env.FIREBASE_AUTHDOMAIN,
  projectId: env.FIREBASE_PROJECTID,
  storageBucket: env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: env.FIREBASE_MESSAGINGSENDERID,
  appId: env.FIREBASE_APPID,
}

export function getFirebaseApp() {
  let firebaseApp
  // Do not initialize app if it is already initialized
  if (firebase.apps.length > 0) {
    firebaseApp = firebase.app()
  } else {
    firebaseApp = firebase.initializeApp(FIREBASE_CONFIG)
  }
  return firebaseApp
}

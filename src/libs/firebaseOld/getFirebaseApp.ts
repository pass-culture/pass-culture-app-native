// eslint-disable-next-line no-restricted-imports
import firebase from 'firebase/app'

import { FIREBASE_CONFIG } from './firebaseConfig'

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

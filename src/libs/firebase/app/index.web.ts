// eslint-disable-next-line no-restricted-imports
import { getApps, getApp, initializeApp } from 'firebase/app'

// eslint-disable-next-line no-restricted-imports
import 'firebase/firestore'

// TODO separate concerns
import { FIREBASE_CONFIG } from '../../firebaseImpl/firebaseConfig'

export function getFirebaseApp() {
  let firebaseApp
  // Do not initialize app if it is already initialized
  if (getApps().length > 0) {
    firebaseApp = getApp()
  } else {
    firebaseApp = initializeApp(FIREBASE_CONFIG)
  }
  return firebaseApp
}

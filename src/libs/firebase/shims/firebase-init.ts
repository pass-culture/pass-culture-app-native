import { initializeApp, getApps, getApp } from 'firebase/app'

import { FIREBASE_CONFIG } from 'libs/firebase/firebaseConfig'

const init = () => {
  // Check if an app is already initialized (useful for Hot Reloading in Dev)
  if (getApps().length === 0) {
    return initializeApp(FIREBASE_CONFIG)
  }
  // If already initialized, return the existing instance
  return getApp()
}

export default init

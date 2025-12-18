// web only
// Native builds get the config from google-services.json GoogleService-Info.plist
import { initializeApp, getApps, getApp } from 'firebase/app'

import { FIREBASE_CONFIG } from 'libs/firebase/firebaseConfig'

const init = () => {
  if (getApps().length === 0) {
    return initializeApp(FIREBASE_CONFIG)
  }
  return getApp()
}

export default init

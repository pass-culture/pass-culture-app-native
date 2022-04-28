// web only
// Native builds get the config from google-services.json GoogleService-Info.plist
// eslint-disable-next-line no-restricted-imports
import firebase from 'firebase/compat/app'

import { FIREBASE_CONFIG } from 'libs/firebase/firebaseConfig'

const initializeApp = (): void => {
  firebase.initializeApp(FIREBASE_CONFIG)
}

export default initializeApp

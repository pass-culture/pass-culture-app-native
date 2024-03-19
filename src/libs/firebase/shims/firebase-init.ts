// web only
// Native builds get the config from google-services.json GoogleService-Info.plist
import firebase from 'firebase/compat/app'

import { FIREBASE_CONFIG } from 'libs/firebase/firebaseConfig'

const initializeApp = () => {
  return firebase.initializeApp(FIREBASE_CONFIG)
}

export default initializeApp

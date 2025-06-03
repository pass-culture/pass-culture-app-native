// web only
// Native builds get the config from google-services.json GoogleService-Info.plist
import firebase from 'firebase/compat/app'

import { FIREBASE_CONFIG, FIREBASE_CONFIG_VERTEX } from 'libs/firebase/firebaseConfig'

const initializeApp = () => {
  return firebase.initializeApp(FIREBASE_CONFIG)
}

export const initializeVertexApp = () => {
  return firebase.initializeApp(FIREBASE_CONFIG_VERTEX)
}

export default initializeApp

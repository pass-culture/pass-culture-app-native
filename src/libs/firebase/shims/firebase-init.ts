// web only
// Native builds get the config from google-services.json GoogleService-Info.plist
import { initializeApp } from 'firebase/app'

import { FIREBASE_CONFIG } from 'libs/firebase/firebaseConfig'

export const app = initializeApp(FIREBASE_CONFIG)

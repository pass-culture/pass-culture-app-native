import { getFirebaseApp } from '../getFirebaseApp'
// eslint-disable-next-line no-restricted-imports
import 'firebase/firestore'

const firebaseApp = getFirebaseApp()
export const firestoreRemoteStore = firebaseApp.firestore()

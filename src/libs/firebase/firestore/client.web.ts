import { getFirebaseApp } from '../getFirebaseApp'
import 'firebase/firestore'

const firebaseApp = getFirebaseApp()
export const firestoreRemoteStore = firebaseApp.firestore()

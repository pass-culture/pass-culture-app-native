import { getFirebaseApp } from 'libs/firebase'
import 'firebase/firestore'

const firebaseApp = getFirebaseApp()
export const firestoreRemoteStore = firebaseApp.firestore()

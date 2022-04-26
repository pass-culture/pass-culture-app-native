import { getFirestore } from 'firebase/firestore'

import { getFirebaseApp } from 'libs/firebase'

const firebaseApp = getFirebaseApp()
export const firestoreRemoteStore = getFirestore(firebaseApp)

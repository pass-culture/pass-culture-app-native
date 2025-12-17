import {
  getFirestore,
  initializeFirestore,
  // New Cache Imports:
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  getDoc,
  enableNetwork,
  disableNetwork,
} from 'firebase/firestore'
export type { DocumentData, DocumentSnapshot } from 'firebase/firestore'

import initializeApp from '../firebase-init'

const app = initializeApp()

export { app }

export {
  getFirestore,
  initializeFirestore,
  // Export new cache functions
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  getDoc,
  enableNetwork,
  disableNetwork,
}

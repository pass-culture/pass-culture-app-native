export type { DocumentData, DocumentSnapshot } from 'firebase/firestore'

import app from '../firebase-init'

export { app }

export {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  getDoc,
  enableNetwork,
  disableNetwork,
} from 'firebase/firestore'

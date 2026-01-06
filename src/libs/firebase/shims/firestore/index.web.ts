export type { DocumentData, DocumentSnapshot } from 'firebase/firestore'

export { app } from '../firebase-init'

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

import {
  doc,
  getDoc,
  enableNetwork,
  disableNetwork,
  getFirestore,
} from 'libs/firebase/shims/firestore'

const firestoreRemoteStore = getFirestore()
disableNetwork(firestoreRemoteStore)

export { firestoreRemoteStore, doc, getDoc, enableNetwork, disableNetwork }

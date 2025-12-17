import {
  collection,
  doc,
  getDoc,
  enableNetwork,
  disableNetwork,
  getFirestore,
} from 'libs/firebase/shims/firestore'

const firestoreRemoteStore = getFirestore()
disableNetwork(firestoreRemoteStore)

export { firestoreRemoteStore, collection, doc, getDoc, enableNetwork, disableNetwork }

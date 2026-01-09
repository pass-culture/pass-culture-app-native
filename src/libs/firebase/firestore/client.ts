import { disableNetwork, getFirestore } from 'libs/firebase/shims/firestore'

export const firestoreRemoteStore = getFirestore()
disableNetwork(firestoreRemoteStore)

export { doc, getDoc, enableNetwork, disableNetwork } from 'libs/firebase/shims/firestore'

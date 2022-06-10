import firestore from 'libs/firebase/shims/firestore'

export const firestoreRemoteStore = firestore()

firestoreRemoteStore.settings({
  cacheSizeBytes: 0,
  persistence: false,
})

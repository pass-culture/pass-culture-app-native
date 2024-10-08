import firestore from 'libs/firebase/shims/firestore/index.web'

export const firestoreRemoteStore = firestore()
firestoreRemoteStore.settings({ experimentalAutoDetectLongPolling: true, merge: true })
firestoreRemoteStore.enablePersistence({ synchronizeTabs: true })

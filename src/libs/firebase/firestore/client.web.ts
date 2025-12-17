import {
  app,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  collection,
  doc,
  getDoc,
  enableNetwork,
  disableNetwork,
} from 'libs/firebase/shims/firestore/index.web'

const firestoreRemoteStore = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
})

export { firestoreRemoteStore, collection, doc, getDoc, enableNetwork, disableNetwork }

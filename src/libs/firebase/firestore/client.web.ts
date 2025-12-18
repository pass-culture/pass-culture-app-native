import {
  app,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'libs/firebase/shims/firestore/index.web'

export const firestoreRemoteStore = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
})

export {
  collection,
  doc,
  getDoc,
  enableNetwork,
  disableNetwork,
} from 'libs/firebase/shims/firestore/index.web'

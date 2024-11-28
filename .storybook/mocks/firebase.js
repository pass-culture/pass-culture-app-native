const firebase = {
  initializeApp: () => ({
    remoteConfig: () => ({ getProvider: () => ({}) }),
  }),
  analytics: () => ({
    getAppInstanceId: () => {},
    logEvent: () => {},
    setAnalyticsCollectionEnabled: () => {},
    setDefaultEventParameters: () => {},
    setUserId: () => {},
  }),
  firestore: () => ({
    settings: () => {},
    enablePersistence: () => true,
    collection: () => ({
      doc: () => ({
        get: () => {},
        set: () => {},
        update: () => {},
        delete: () => {},
        onSnapshot: (callback) => {
          callback({ data: () => {}, get: () => {} })
          return () => {}
        },
      }),
    }),
  }),
}

export default firebase

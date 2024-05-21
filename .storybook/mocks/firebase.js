const firebase = {
  initializeApp: () => {},
  analytics: () => ({
    getAppInstanceId: () => {},
    logEvent: () => {},
    setAnalyticsCollectionEnabled: () => {},
    setDefaultEventParameters: () => {},
    setUserId: () => {},
  }),
  firestore: () => ({
    settings: () => {},
    collection: () => ({
      doc: () => ({
        get: async () => ({}),
      }),
    }),
  }),
}

export default firebase

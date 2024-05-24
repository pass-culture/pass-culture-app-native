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
  }),
}

export default firebase

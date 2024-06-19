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
  }),
}

export default firebase

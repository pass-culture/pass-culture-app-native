export const firebaseAnalytics = {
  logEvent: jest.fn(),
  setAnalyticsCollectionEnabled: jest.fn(),
  setUserId: jest.fn(),
}
const docSnapshopt = { get: jest.fn() }
export const firebaseFirestore = {
  collection: jest.fn().mockReturnValue({
    doc: jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({
        data: jest.fn().mockResolvedValue(undefined),
      }),
      onSnapshot: jest.fn().mockImplementation((successCallback) => successCallback(docSnapshopt)),
    }),
  }),
}

export const firebaseApp = {
  analytics: () => firebaseAnalytics,
  firestore: () => firebaseFirestore,
}

export function getFirebaseApp() {
  return firebaseApp
}

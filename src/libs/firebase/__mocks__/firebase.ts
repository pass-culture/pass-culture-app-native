export const firebaseAnalytics = {
  logEvent: jest.fn(),
  setAnalyticsCollectionEnabled: jest.fn(),
  setUserId: jest.fn(),
}

export const firebaseApp = {
  analytics: () => firebaseAnalytics,
}

export function getFirebaseApp() {
  return firebaseApp
}

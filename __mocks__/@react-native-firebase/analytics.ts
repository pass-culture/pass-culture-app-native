const firebaseAnalytics = () => ({
  disableCollection: jest.fn(),
  enableCollection: jest.fn(),
  getAppInstanceId: jest.fn().mockReturnValue('firebase_pseudo_id'),
  logEvent: jest.fn(),
  logScreenView: jest.fn(),
  setDefaultEventParameters: jest.fn(),
  setUserId: jest.fn(),
  setAnalyticsCollectionEnabled: jest.fn(),
})

module.exports = firebaseAnalytics

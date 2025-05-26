module.exports = {
  __esModule: true,
  default: {
    setConsentData: jest.fn(),
    initSdk: jest.fn(),
    logEvent: jest.fn(),
    getAppsFlyerUID: jest.fn((callback) => callback(null, 'mocked-uid')),
    stop: jest.fn(),
  },
  AppsFlyerConsent: jest
    .fn()
    .mockImplementation(
      (
        isUserSubjectToGDPR,
        hasConsentForDataUsage,
        hasConsentForAdsPersonalization,
        hasConsentForAdStorage
      ) => {
        return {
          isUserSubjectToGDPR,
          hasConsentForDataUsage,
          hasConsentForAdsPersonalization,
          hasConsentForAdStorage,
        }
      }
    ),
}

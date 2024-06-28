export default {
  logEvent: jest.fn(),
  setConsentData: jest.fn(),
  initSdk: jest.fn(),
  getAppsFlyerUID: jest.fn(),
}

export const AppsFlyerConsent = {
  forGDPRUser: jest.fn((hasConsentForDataUsage, hasConsentForAdsPersonalization) => ({
    hasConsentForDataUsage,
    hasConsentForAdsPersonalization,
  })),
  forNonGDPRUser: jest.fn(),
}

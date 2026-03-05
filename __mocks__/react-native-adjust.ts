export const setLogLevelMock = jest.fn()
export const setAttConsentWaitingIntervalMock = jest.fn()

export const addGranularOptionMock = jest.fn()

export const Adjust = {
  initSdk: jest.fn(),
  enable: jest.fn(),
  disable: jest.fn(),
  isEnabled: jest.fn(),
  trackEvent: jest.fn(),
  trackMeasurementConsent: jest.fn(),
  trackThirdPartySharing: jest.fn(),
  gdprForgetMe: jest.fn(),
  getAppTrackingAuthorizationStatus: jest.fn(),
  requestAppTrackingAuthorization: jest.fn(),
}

export const AdjustConfig = jest
  .fn()
  .mockImplementation((appToken: string, environment: string) => {
    return {
      appToken,
      environment,
      setLogLevel: setLogLevelMock,
      setAttConsentWaitingInterval: setAttConsentWaitingIntervalMock,
    }
  })

export const AdjustEvent = jest.fn()

export const AdjustThirdPartySharing = jest.fn().mockImplementation((isEnabled: boolean | null) => {
  return {
    addGranularOption: addGranularOptionMock,
    isEnabled,
  }
})

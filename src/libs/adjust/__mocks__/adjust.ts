import { Adjust as AdjustType } from 'libs/adjust/types'

export const Adjust: AdjustType = {
  initOrEnable: jest.fn(),
  disable: jest.fn(),
  gdprForgetMe: jest.fn(),
  logEvent: jest.fn(),
  TrackingStatus: {
    DENIED: 0,
    AUTHORIZED: 1,
    RESTRICTED: 2,
    NOT_DETERMINED: 3,
  },
  getOrRequestAppTrackingAuthorization: jest.fn(),
}

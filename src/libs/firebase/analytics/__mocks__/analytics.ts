import { firebaseAnalytics as actualAnalytics } from '../analytics'

export const firebaseAnalytics: typeof actualAnalytics = {
  disableCollection: jest.fn(),
  enableCollection: jest.fn(),
  getAppInstanceId: jest.fn().mockReturnValue('firebase_pseudo_id'),
  logEvent: jest.fn(),
  logLogin: jest.fn(),
  logScreenView: jest.fn(),
  setDefaultEventParameters: jest.fn(),
  setUserId: jest.fn(),
  useInit: jest.fn(),
}

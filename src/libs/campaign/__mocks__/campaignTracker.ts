import { CampaignTracker } from '../types'

export const campaignTracker: CampaignTracker = {
  logEvent: jest.fn(),
  getUserId: jest.fn().mockResolvedValue('uniqueCustomerId'),
  useInit: jest.fn(),
  startAppsFlyer: jest.fn(),
}

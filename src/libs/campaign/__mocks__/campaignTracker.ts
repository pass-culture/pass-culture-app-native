import { CampaignTracker } from '../types'

export const campaignTracker: CampaignTracker = {
  logEvent: jest.fn(),
  getUserId: jest.fn().mockResolvedValue('uniqueCustomerId'),
  init: jest.fn(),
  startAppsFlyer: jest.fn(),
}

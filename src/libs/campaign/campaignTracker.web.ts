import { CampaignEvents } from './events'
import { CampaignTracker } from './types'

async function logEvent(event: CampaignEvents, params: Record<string, unknown>): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('campaignTracker event', event, 'params', params)
}

export const campaignTracker: CampaignTracker = {
  logEvent,
  getUserId: async () => undefined,
  init: () => undefined,
  startAppsFlyer: () => undefined,
}

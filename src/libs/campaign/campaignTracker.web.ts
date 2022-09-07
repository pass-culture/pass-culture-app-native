import { CampaignEvents } from './events'
import { CampaignTracker } from './types'

function useInit() {
  // nothing
}

async function logEvent(event: CampaignEvents, params: Record<string, unknown>): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('campaignTracker event', event, 'params', params)
}

async function getUserId(): Promise<string | undefined> {
  return undefined
}

function startAppsFlyer() {
  return
}

export const campaignTracker: CampaignTracker = {
  logEvent,
  getUserId,
  useInit,
  startAppsFlyer,
}

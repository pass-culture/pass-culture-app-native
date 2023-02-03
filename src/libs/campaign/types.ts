import { CampaignEvents } from 'libs/campaign/events'

export interface CampaignTracker {
  logEvent: (event: CampaignEvents, params: Record<string, unknown>) => Promise<void>
  getUserId: () => Promise<string | undefined>
  useInit: (hasAcceptedMarketingCookie: boolean) => void
  startAppsFlyer: (enabled: boolean) => void
}

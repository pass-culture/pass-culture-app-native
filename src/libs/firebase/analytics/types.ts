import { AnalyticsEvent } from 'libs/firebase/analytics/events'

export interface AnalyticsProvider {
  disableCollection: () => Promise<void>
  enableCollection: () => Promise<void>
  getAppInstanceId: () => Promise<string | null>
  setDefaultEventParameters: (params: Record<string, unknown> | undefined) => Promise<void>
  setUserId: (userId: number) => Promise<void>
  logScreenView: (screenName: string, locationType: string) => Promise<void>
  logEvent: (name: AnalyticsEvent, params?: Record<string, unknown>) => Promise<void>
}

export enum AgentType {
  'browser_computer' = 'browser_computer',
  'browser_mobile' = 'browser_mobile',
  'agent_mobile' = 'agent_mobile',
}

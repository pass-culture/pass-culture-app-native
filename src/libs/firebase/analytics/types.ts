import { AnalyticsEvent } from 'libs/firebase/analytics/events'

type AnalyticsParam = Record<string, unknown>

export type LoginRoutineMethod = 'fromLogin' | 'fromSignup' | 'fromSetEmail'

export interface AnalyticsProvider {
  disableCollection: () => Promise<void> | void
  enableCollection: () => Promise<void> | void
  setDefaultEventParameters: (params: Record<string, unknown> | undefined) => Promise<void> | void
  setUserId: (userId: number) => Promise<void> | void
  logScreenView: (screenName: string) => Promise<void> | void
  logLogin: ({ method }: { method: LoginRoutineMethod }) => Promise<void> | void
  logEvent: <P extends AnalyticsParam>(name: AnalyticsEvent, params?: P) => Promise<void> | void
}

export type OfferAnalyticsData = {
  offerId?: number
}

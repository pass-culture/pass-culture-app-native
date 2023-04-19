import { AmplitudeEvent } from 'libs/amplitude/events'
import { logEventAnalytics } from 'libs/analytics/logEventAnalytics'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'

export type AnalyticsProvider = {
  disableCollection: () => Promise<void>
  enableCollection: () => Promise<void>
  logScreenView: (screenName: string) => Promise<void>
  logEvent: (
    eventName: { firebase?: AnalyticsEvent; amplitude?: AmplitudeEvent },
    params?: Record<string, unknown>
  ) => Promise<void>
} & typeof logEventAnalytics

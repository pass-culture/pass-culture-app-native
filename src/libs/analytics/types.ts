import { Referrals, ScreenNames } from 'features/navigation/RootNavigator/types'
import { AmplitudeEvent } from 'libs/amplitude/events'
import { logEventAnalytics } from 'libs/analytics/logEventAnalytics'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'

type EventName =
  | { firebase: AnalyticsEvent; amplitude?: AmplitudeEvent }
  | { firebase?: AnalyticsEvent; amplitude: AmplitudeEvent }

export type AnalyticsProvider = {
  disableCollection: () => Promise<void>
  enableCollection: () => Promise<void>
  logScreenView: (screenName: ScreenNames) => Promise<void>
  logEvent: (eventName: EventName, params?: Record<string, unknown>) => Promise<void>
} & typeof logEventAnalytics

export type OfferAnalyticsParams = {
  from: Referrals
  query?: string
  index?: number
  searchId?: string
  moduleName?: string
  moduleId?: string
  homeEntryId?: string
}

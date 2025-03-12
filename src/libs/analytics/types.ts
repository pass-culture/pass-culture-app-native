import { Referrals, ScreenNames } from 'features/navigation/RootNavigator/types'
import { PlaylistType } from 'features/offer/enums'
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
  setEventLocationType: () => Promise<void>
} & typeof logEventAnalytics

export type OfferAnalyticsParams = {
  from: Referrals
  query?: string
  index?: number
  searchId?: string
  moduleName?: string
  moduleId?: string
  homeEntryId?: string
  apiRecoParams?: string
  playlistType?: PlaylistType
  artistName?: string
}

export type ConsultOfferLogParams = {
  offerId: number
  from: Referrals
  moduleId?: string
  moduleName?: string
  query?: string
  venueId?: number
  homeEntryId?: string
  searchId?: string
  fromOfferId?: number
  fromMultivenueOfferId?: number
  playlistType?: PlaylistType
  offer_display_index?: number
  index?: number
  artistName?: string
  isHeadline?: boolean
}

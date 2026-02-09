import { Referrals, ScreenNames } from 'features/navigation/navigators/RootNavigator/types'
import { PlaylistType } from 'features/offer/enums'
import { logEventAnalytics } from 'libs/analytics/logEventAnalytics'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'

type EventName = { firebase: AnalyticsEvent }

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
  isHeadline?: boolean
}

export type ConsultOfferLogParams = {
  offerId: number | string
  from: Referrals
  moduleId?: string
  moduleName?: string
  query?: string
  venueId?: number
  homeEntryId?: string
  searchId?: string
  fromOfferId?: number | string
  fromMultivenueOfferId?: number | string
  playlistType?: PlaylistType
  offer_display_index?: number
  index?: number
  artistName?: string
  isHeadline?: boolean
}

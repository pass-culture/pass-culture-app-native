import { AmplitudeEvent } from 'libs/amplitude/events'
import { logEventAnalytics } from 'libs/analytics/logEventAnalytics'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'

export type AnalyticsProvider = {
  disableCollection: () => Promise<void> | void
  enableCollection: () => Promise<void> | void
  logScreenView: (screenName: string) => Promise<void> | void
  logEvent: (
    eventName: { firebase?: AnalyticsEvent; amplitude?: AmplitudeEvent },
    params?: Record<string, unknown>
  ) => Promise<void> | void
} & typeof logEventAnalytics

type BaseThematicHome = {
  homeEntryId: string
  from?: never
  moduleId?: never
  moduleListId?: never
}

type CategoryBlockThematicHome = BaseThematicHome & {
  from: 'category_block'
  moduleId: string
  moduleListId: string
}

type HighlightThematicBlockThematicHome = BaseThematicHome & {
  from: 'highlight_thematic_block'
  moduleId: string
  moduleListId?: never
}

export type ChangeSearchLocationParam =
  | { type: 'place' | 'everywhere' | 'aroundMe' }
  | { type: 'venue'; venueId: number | null }

export type ConsultHomeParams =
  | BaseThematicHome
  | CategoryBlockThematicHome
  | HighlightThematicBlockThematicHome

export type OfferIdOrVenueId = { offerId: number } | { venueId: number }

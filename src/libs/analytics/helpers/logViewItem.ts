import { analytics } from 'libs/analytics/provider'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'

export type ViewItemParams = {
  origin: 'home' | 'search' | 'offer' | 'artist' | 'venue' | 'venueMap'
  originId: HomeEntryId | SearchId | OfferId | ArtistId | VenueId
  type: 'offer' | 'venue' | 'artist'
  id: OfferId | VenueId | ArtistId
  playlistId:
    | HomeEntryId
    | 'searchResults'
    | 'searchResultsVenuePlaylist'
    | 'thematicSearchVenuePlaylist'
    | 'venue_offers_list'
    | 'venue_artists_carousel'
    | 'venue_map'
    | 'sameCategorySimilarOffers'
    | 'booksSameCategorySimilarOffers'
    | 'otherCategoriesSimilarOffers'
  playlistIndex: number
  index: number
  callId?: string
}

type HomeEntryId = string & {}
type SearchId = string & {}
type VenueId = string & {}
type ArtistId = string & {}
type OfferId = string & {}

export const logViewItem = (params: ViewItemParams) => {
  void analytics.logEvent(
    { firebase: AnalyticsEvent.VIEW_ITEM },
    {
      event_timestamp: new Date().toISOString(),
      ...params,
    }
  )
}

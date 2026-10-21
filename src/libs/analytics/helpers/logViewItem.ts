import { analytics } from 'libs/analytics/provider'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'

export type ViewItemParams = {
  origin: 'home' | 'search' | 'offer' | 'artist' | 'venue' | 'venueMap'
  originId: HomeEntryId | SearchId | OfferId | ArtistId | VenueId | ThematicSearchOriginId
  type: 'offer' | 'venue' | 'artist'
  id: OfferId | VenueId | ArtistId
  playlistId:
    | HomeEntryId
    | 'searchResults'
    | 'searchResultsVenuePlaylist'
    | 'searchResultsArtistPlaylist'
    | 'thematicSearchVenuePlaylist'
    | 'venueOffersList'
    | 'artistTopOffers'
    | ArtistCategoryPlaylistId
    | 'artistSimilarArtists'
    | 'venueArtistsCarousel'
    | 'venueMap'
    | 'sameCategorySimilarOffers'
    | 'booksSameCategorySimilarOffers'
    | 'otherCategoriesSimilarOffers'
    | 'thematicSearchOfferPlaylist'
  playlistIndex: number
  index: number
  callId?: string
  eventTimestamp?: string
}

export type ThematicSearchOriginId = `thematicSearch${ThematicSearchCategory}`
type ThematicSearchCategory = 'Cinema' | 'Concerts' | 'Films' | 'Music'

export type ArtistCategoryPlaylistId =
  | 'artistOffersConcertsFestivals'
  | 'artistOffersSpectacles'
  | 'artistOffersLivres'
  | 'artistOffersFestivalsSalonsLivre'
  | 'artistOffersMusique'
  | 'artistOffersFilmsAffiche'
  | 'artistOffersEvenementsCinema'
  | 'artistOffersFilmsSeriesDocumentaires'
  | 'artistOffersArtsLoisirsCreatifs'
  | 'artistOffersMuseesVisites'
  | 'artistOffersEvenementsCulturels'
  | 'artistOffersConferencesRencontres'
  | 'artistOffersEvenementsEnLigne'
  | 'artistOffersMediasPresse'

declare const homeEntryIdBrand: unique symbol
type HomeEntryId = string & { readonly [homeEntryIdBrand]: 'HomeEntryId' }

export const asHomeEntryId = (id: string): HomeEntryId => id as HomeEntryId

type SearchId = string
type VenueId = string
type ArtistId = string
type OfferId = string

export const logViewItem = (params: ViewItemParams) => {
  void analytics.logEvent(
    { firebase: AnalyticsEvent.VIEW_ITEM },
    {
      eventTimestamp: new Date().toISOString(),
      ...params,
    }
  )
}

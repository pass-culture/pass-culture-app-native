import { SearchGroupNameEnumv2 } from 'api/gen'
import { ThematicSearchCategories } from 'features/navigation/navigators/SearchStackNavigator/types'
import { PlaylistType } from 'features/offer/enums'
import { analytics } from 'libs/analytics/provider'
import { AnalyticsEvent } from 'libs/firebase/analytics/events'

// thematic search musique, thematicsearchvenueId et origin id doit etre thematicSearchmusic et pas l'id de la recherche (uuidev4), thematicSearchBook a aussi ce problème sur les offres, cinema, concert
export type ViewItemParams = {
  origin: 'home' | 'search' | 'offer' | 'artist' | 'venue' | 'venueMap'
  originId: HomeEntryId | SearchId | OfferId | ArtistId | VenueId | ThematicSearchOriginId
  type: 'offer' | 'venue' | 'artist'
  id: OfferId | VenueId | ArtistId
  playlistId:
    | HomeEntryId
    | ArtistCategoryPlaylistId
    | `${PlaylistType.SEARCH_RESULTS}`
    | `${PlaylistType.ARTIST_TOP_OFFERS}`
    | OfferPagePlaylistId
    | 'searchResultsVenuePlaylist'
    | 'searchResultsArtistPlaylist'
    | 'venueOffersList'
    | 'artistSimilarArtists'
    | 'venueArtistsCarousel'
    | 'venueMap'
    | 'thematicSearchPlaylist'
  playlistIndex: number
  index: number
  callId?: string
  eventTimestamp?: string
}

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

type HomeEntryId = string & { readonly __brand: 'HomeEntryId' }
type SearchId = string & { readonly __brand: 'SearchId' }
type OfferId = string & { readonly __brand: 'OfferId' }
type ArtistId = string & { readonly __brand: 'ArtistId' }
type VenueId = string & { readonly __brand: 'VenueId' }
type OfferPagePlaylistId = string & { readonly __brand: 'OfferPagePlaylistId' }

export const asHomeEntryId = (id: string): HomeEntryId => id as HomeEntryId
export const asSearchId = (id: string): SearchId => id as SearchId
export const asOfferId = (id: string): OfferId => id as OfferId
export const asArtistId = (id: string): ArtistId => id as ArtistId
export const asVenueId = (id: string): VenueId => id as VenueId
export const asOfferPagePlaylistId = (id: string): OfferPagePlaylistId => id as OfferPagePlaylistId

export const THEMATIC_SEARCH_ORIGIN_ID_BY_CATEGORY = {
  [SearchGroupNameEnumv2.CINEMA]: 'thematicSearchCinema',
  [SearchGroupNameEnumv2.CONCERTS_FESTIVALS]: 'thematicSearchConcertsFestivals',
  [SearchGroupNameEnumv2.FILMS_DOCUMENTAIRES_SERIES]: 'thematicSearchFilmsSeriesDocumentaires',
  [SearchGroupNameEnumv2.LIVRES]: 'thematicSearchLivres',
  [SearchGroupNameEnumv2.MUSIQUE]: 'thematicSearchMusique',
} as const satisfies Record<ThematicSearchCategories, `thematicSearch${string}`>

export type ThematicSearchOriginId =
  (typeof THEMATIC_SEARCH_ORIGIN_ID_BY_CATEGORY)[ThematicSearchCategories]

export const logViewItem = (params: ViewItemParams) => {
  void analytics.logEvent(
    { firebase: AnalyticsEvent.VIEW_ITEM },
    {
      eventTimestamp: new Date().toISOString(),
      ...params,
    }
  )
}

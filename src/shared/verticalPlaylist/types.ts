import { OfferResponse, SearchGroupNameEnumv2, SearchGroupResponseModelv2 } from 'api/gen'
import { OffersModule } from 'features/home/types'
import { PlaylistType } from 'features/offer/enums'
import { ThematicSearchPlaylistData } from 'features/search/pages/ThematicSearch/types'
import { Offer } from 'shared/offer/types'
import { VerticalPlaylist } from 'shared/verticalPlaylist/enums'

export type OffersSimilars = {
  offer: OfferResponse
  offerSearchGroup: SearchGroupNameEnumv2
  searchGroupList: SearchGroupResponseModelv2[]
  type: PlaylistType
}

export type OffersVenue = {
  venueId: number
  playlistTitle: string
}

export type VerticalPlaylistSource =
  | { type: VerticalPlaylist.ModuleOffers; module: OffersModule }
  | { type: VerticalPlaylist.SimilarOffers; module: OffersSimilars }
  | { type: VerticalPlaylist.VenueOffers; module: OffersVenue }
  | { type: VerticalPlaylist.ThematicSearchOffers; module: ThematicSearchPlaylistData }

export type VerticalPlaylistData = {
  items: Offer[]
  title: string
  subtitle?: string
  searchId?: string
  searchQuery?: string
}

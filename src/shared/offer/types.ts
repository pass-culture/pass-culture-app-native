import { RecommendationApiParams } from 'api/gen'
import { PlaylistType } from 'features/offer/enums'
import { AlgoliaOffer } from 'libs/algolia/types'

export type Offer = AlgoliaOffer

export type SimilarOffersPlaylistType =
  | PlaylistType.SAME_CATEGORY_SIMILAR_OFFERS
  | PlaylistType.BOOKS_SAME_CATEGORY_SIMILAR_OFFERS
  | PlaylistType.OTHER_CATEGORIES_SIMILAR_OFFERS

export type SimilarOfferPlaylist = {
  type: SimilarOffersPlaylistType
  title: string
  handleChangePlaylistDisplay: (inView: boolean) => void
  offers?: Offer[]
  apiRecoParams?: RecommendationApiParams
}

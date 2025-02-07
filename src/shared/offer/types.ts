import { RecommendationApiParams } from 'api/gen'
import { PlaylistType } from 'features/offer/enums'
import { AlgoliaOffer } from 'libs/algolia/types'

export type Offer = AlgoliaOffer

export type SimilarOfferPlaylist = {
  type: PlaylistType
  title: string
  handleChangePlaylistDisplay: (inView: boolean) => void
  offers?: Offer[]
  apiRecoParams?: RecommendationApiParams
}

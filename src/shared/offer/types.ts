import { RecommendationApiParams, SubcategoryIdEnum } from 'api/gen'
import { PlaylistType } from 'features/offer/enums'

export type OfferLocation = {
  lat?: number | null
  lng?: number | null
}

export type HitOffer = {
  dates?: number[]
  isDigital?: boolean
  isDuo?: boolean
  isEducational?: boolean
  name?: string
  prices?: number[]
  subcategoryId: SubcategoryIdEnum
  thumbUrl?: string
  releaseDate?: number | string
}

export interface Offer {
  offer: HitOffer
  objectID: string
  _geoloc: OfferLocation
  venue: {
    departmentCode?: string
    id?: number
    name?: string
    publicName?: string
    address?: string
    postalCode?: string
    city?: string
  }
}

export type SimilarOfferPlaylist = {
  type: PlaylistType
  title: string
  handleChangePlaylistDisplay: (inView: boolean) => void
  offers?: Offer[]
  apiRecoParams?: RecommendationApiParams
}

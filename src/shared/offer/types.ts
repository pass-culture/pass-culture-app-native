import { SubcategoryIdEnum } from 'api/gen'
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

export interface RecommendationApiParams {
  call_id?: string
  filtered?: boolean
  geo_located?: boolean
  model_endpoint?: string
  model_name?: string
  model_version?: string
  reco_origin?: string
}

export type SimilarOfferPlaylist = {
  type: PlaylistType
  title: string
  offers?: Offer[]
  apiRecoParams?: RecommendationApiParams
  handleChangePlaylistDisplay: (inView: boolean) => void
}

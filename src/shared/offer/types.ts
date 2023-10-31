import { SubcategoryIdEnum } from 'api/gen'

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

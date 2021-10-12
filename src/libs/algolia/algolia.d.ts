import { SubcategoryIdEnum } from 'api/gen'

interface Offer {
  dates?: number[]
  isDigital?: boolean
  isDuo?: boolean
  name?: string
  prices?: number[]
  subcategoryId?: SubcategoryIdEnum
  thumbUrl?: string
}

export interface Geoloc {
  lat?: number | null
  lng?: number | null
}

export interface AlgoliaHit {
  offer: Offer
  _geoloc: Geoloc
  objectID: string
}

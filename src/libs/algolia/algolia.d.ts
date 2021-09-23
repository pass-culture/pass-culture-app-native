import { CategoryNameEnum, SubcategoryIdEnum } from 'api/gen'

interface Offer {
  category: CategoryNameEnum | null
  subcategoryId: SubcategoryIdEnum
  dates?: number[]
  isDigital?: boolean
  isDuo?: boolean
  name?: string
  prices?: number[]
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

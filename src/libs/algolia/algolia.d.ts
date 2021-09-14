import { CategoryIdEnum } from 'api/gen'

interface Offer {
  category: CategoryIdEnum | null
  dates?: number[]
  description?: string | null
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

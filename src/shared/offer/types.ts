import { SubcategoryIdEnum } from 'api/gen'

export interface Offer {
  offer: {
    dates?: number[]
    isDigital?: boolean
    isDuo?: boolean
    isEducational?: boolean
    name?: string
    prices?: number[]
    subcategoryId: SubcategoryIdEnum
    thumbUrl?: string
  }
  objectID: string
  _geoloc: {
    lat?: number | null
    lng?: number | null
  }
}

import { SubcategoryIdEnum } from 'api/gen'

export type OfferLocation = {
  lat?: number | null
  lng?: number | null
}

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

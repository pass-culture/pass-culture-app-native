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

export interface OffersWithPage {
  offers: Offer[]
  nbOffers: 0
  page: 0
  nbPages: 0
}

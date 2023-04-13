import { SubcategoryIdEnum } from 'api/gen'

export interface Offer {
  offer: OfferAttributes
  objectID: string
  _geoloc: {
    lat?: number | null
    lng?: number | null
  }
}

export interface OfferAttributes {
  subcategoryId: SubcategoryIdEnum
  dates?: number[]
  isDigital?: boolean
  isDuo?: boolean
  isEducational?: boolean
  name?: string
  prices: number[] | undefined
  thumbUrl: string | undefined
}
export interface OffersWithPage {
  offers: Offer[]
  nbOffers: 0
  page: 0
  nbPages: 0
}

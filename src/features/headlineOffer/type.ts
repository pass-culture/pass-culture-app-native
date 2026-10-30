import { CategoryIdEnum } from 'api/gen'

export interface VenueProAdvice {
  author?: string | null
  content: string
  offerCategoryLabel: string
  offerId: number
  offerName: string
  offerThumbUrl?: string | null
  publicationDatetime: string
}

export type HeadlineOfferData = {
  id: string
  imageUrl: string
  categoryId: CategoryIdEnum
  category: string
  price: string
  offerTitle?: string
  distance?: string
  advice?: VenueProAdvice
}

import { CategoryIdEnum } from 'api/gen'

export type HeadlineOfferData = {
  id: string
  imageUrl: string
  categoryId: CategoryIdEnum
  category: string
  price: string
  offerTitle?: string
  distance?: string
}

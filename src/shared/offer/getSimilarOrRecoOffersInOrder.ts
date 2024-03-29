import { Offer } from 'shared/offer/types'

export function getSimilarOrRecoOffersInOrder(ids: string[], offers: Offer[]) {
  return ids.map((id) => offers.find((offer) => offer.objectID === id)).filter(Boolean) as Offer[]
}

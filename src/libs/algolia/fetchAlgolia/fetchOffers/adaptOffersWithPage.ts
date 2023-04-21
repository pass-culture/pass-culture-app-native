import { Offer, OffersWithPage } from 'shared/offer/types'

export const adaptOffersWithPage = ({
  nbOffers,
  nbPages,
  offers,
  page,
  userData,
}: {
  offers: Offer[]
  nbOffers: number
  page: number
  nbPages: number
  userData?: unknown
}): OffersWithPage => ({
  offers,
  nbOffers,
  page,
  nbPages,
  userData,
})

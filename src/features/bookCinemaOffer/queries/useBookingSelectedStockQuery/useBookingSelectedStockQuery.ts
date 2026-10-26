import { selectBookingSelectedStock } from 'features/bookCinemaOffer/queries/useBookingSelectedStockQuery/selectBookingSelectedStock'
import { useOfferQuery } from 'queries/offer/useOfferQuery'

export const useBookingSelectedStockQuery = (offerId: number, stockId?: number) =>
  useOfferQuery({
    offerId,
    select: selectBookingSelectedStock(stockId),
  })

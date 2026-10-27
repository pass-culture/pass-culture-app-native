import { convertOfferDatesToTimezone } from 'queries/offer/selectors/convertOfferDatesToTimezone'

type OffersWithDatedStocks = Parameters<typeof convertOfferDatesToTimezone>[0]

export const convertOffererDatesToTimezone = <T extends { offers: OffersWithDatedStocks[] }>(
  data: T
): T =>
  ({
    ...data,
    offers: data.offers.map((offer) => convertOfferDatesToTimezone(offer)),
  }) as T

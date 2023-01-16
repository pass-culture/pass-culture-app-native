import { useMemo } from 'react'

import { FavoriteOfferResponse } from 'api/gen'
import { formatToFrenchDate } from 'libs/parsers'

export const useFavoriteFormattedDate = ({ offer }: { offer: FavoriteOfferResponse }) => {
  const formattedDate = useMemo(() => {
    if (offer.date) return formatToFrenchDate(new Date(offer.date))
    if (offer.startDate) return `Dès le ${formatToFrenchDate(new Date(offer.startDate))}`
    return undefined
  }, [offer.date, offer.startDate])

  return formattedDate
}

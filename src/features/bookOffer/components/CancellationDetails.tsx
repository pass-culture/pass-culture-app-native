import { t } from '@lingui/macro'
import React, { useEffect } from 'react'

import { CategoryType } from 'api/gen'
import { useBooking } from 'features/bookOffer/pages/BookingOfferWrapper'
import { useOffer } from 'features/offer/api/useOffer'
import { _ } from 'libs/i18n'
import { decomposeDate } from 'libs/parsers/formatDates'
import { Spacer, Typo } from 'ui/theme'

const formatDate = (limitDate: Date): string => {
  const limit = new Date(limitDate)
  const { day, month, year } = decomposeDate(limit.getTime())
  return `${day} ${month} ${year}, ${limit.getHours()}h${limit.getMinutes()}`
}

export const CancellationDetails: React.FC = () => {
  const { bookingState, dispatch } = useBooking()
  const { data: offer } = useOffer({ offerId: bookingState.offerId || 0 })
  const { stocks = [] } = offer || {}

  useEffect(() => {
    // This is temporary so that a stock is selected.
    if (stocks[0] && typeof stocks[0].id === 'number') {
      dispatch({ type: 'SELECT_STOCK', payload: stocks[0].id })
    }
  }, [])

  const stock = stocks.find(({ id }) => id === bookingState.stockId)
  if (!offer || !stock) return <React.Fragment />

  const { category, isDigital } = offer
  const { cancellationLimitDatetime: limitDate } = stock

  const message =
    !limitDate || (category.categoryType === CategoryType.Thing && isDigital)
      ? _(t`Cette réservation n’est pas annulable`)
      : _(t`Cette réservation peut être annulée jusqu’au ${formatDate(limitDate)}`)

  return (
    <React.Fragment>
      <Typo.Title4>{_(t`Conditions d'annulation`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Caption>{message}</Typo.Caption>
      <Spacer.Column numberOfSpaces={4} />
    </React.Fragment>
  )
}

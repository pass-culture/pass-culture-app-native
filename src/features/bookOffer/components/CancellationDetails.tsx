import { t } from '@lingui/macro'
import React from 'react'

import { CategoryType } from 'api/gen'
import { useBookingOffer, useBookingStock } from 'features/bookOffer/pages/BookingOfferWrapper'
import { _ } from 'libs/i18n'
import { decomposeDate } from 'libs/parsers/formatDates'
import { Spacer, Typo } from 'ui/theme'

export const formatDate = (limitDate: Date): string => {
  const limit = new Date(limitDate)
  const { day, month, year } = decomposeDate(limit.getTime())
  const minutes = limit.getMinutes() === 0 ? '00' : limit.getMinutes()
  return `${day} ${month} ${year}, ${limit.getHours()}h${minutes}`
}

export const CancellationDetails: React.FC = () => {
  const offer = useBookingOffer()
  const stock = useBookingStock()

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

import { t } from '@lingui/macro'
import React from 'react'

import { useBookingStock } from 'features/bookOffer/pages/BookingOfferWrapper'
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
  const stock = useBookingStock()

  if (!stock) return <React.Fragment />

  const { cancellationLimitDatetime: limitDate } = stock

  let message = _(t`Cette réservation est annulable`)
  if (limitDate) {
    message =
      limitDate < new Date()
        ? _(t`Cette réservation n’est pas annulable`)
        : _(t`Cette réservation peut être annulée jusqu’au ${formatDate(limitDate)}`)
  }

  return (
    <React.Fragment>
      <Typo.Title4>{_(t`Conditions d'annulation`)}</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Caption>{message}</Typo.Caption>
      <Spacer.Column numberOfSpaces={4} />
    </React.Fragment>
  )
}

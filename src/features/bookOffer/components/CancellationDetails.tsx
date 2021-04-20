import { t } from '@lingui/macro'
import React from 'react'

import { useBookingStock } from 'features/bookOffer/pages/BookingOfferWrapper'
import { formatToFrenchDate } from 'libs/parsers/formatDates'
import { Spacer, Typo } from 'ui/theme'

export const formatDate = (limitDate: Date): string => {
  const limit = new Date(limitDate)
  const minutes = limit.getMinutes() === 0 ? '00' : limit.getMinutes()
  return `${formatToFrenchDate(limit)}, ${limit.getHours()}h${minutes}`
}

export const CancellationDetails: React.FC = () => {
  const stock = useBookingStock()

  if (!stock) return <React.Fragment />

  const { cancellationLimitDatetime: limitDate } = stock

  let message = t`Cette réservation est annulable`
  if (limitDate) {
    message =
      limitDate < new Date()
        ? t`Cette réservation n’est pas annulable`
        : t({
            id: "réservation annulable jusqu'au",
            values: { date: formatDate(limitDate) },
            message: 'Cette réservation peut être annulée jusqu’au {date}',
          })
  }

  return (
    <React.Fragment>
      <Typo.Title4>{t`Conditions d'annulation`}</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Caption>{message}</Typo.Caption>
      <Spacer.Column numberOfSpaces={4} />
    </React.Fragment>
  )
}

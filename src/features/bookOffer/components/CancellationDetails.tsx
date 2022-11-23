import React from 'react'

import { useBookingOffer, useBookingStock } from 'features/bookOffer/pages/BookingOfferWrapper'
import { formatToFrenchDate, formatToHour } from 'libs/parsers/formatDates'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

export const formatDate = (limitDate: string): string => {
  const limit = new Date(limitDate)
  return `${formatToFrenchDate(limit)}, ${formatToHour(limit)}`
}

const notCancellableMessage = 'Cette réservation n’est pas annulable'

export const CancellationDetails: React.FC = () => {
  const stock = useBookingStock()
  const offer = useBookingOffer()

  if (!stock || !offer) return <React.Fragment />

  const { activationCode, cancellationLimitDatetime: limitDate } = stock

  let message = 'Cette réservation est annulable'
  if (limitDate) {
    message =
      new Date(limitDate) < new Date()
        ? notCancellableMessage
        : `Cette réservation peut être annulée jusqu’au ${formatDate(limitDate)}`
  }

  if (offer.isDigital && !!activationCode) {
    message = notCancellableMessage
  }

  return (
    <React.Fragment>
      <Typo.Title4 {...getHeadingAttrs(2)}>Conditions d’annulation</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Caption>{message}</Typo.Caption>
    </React.Fragment>
  )
}

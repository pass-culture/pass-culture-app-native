import React from 'react'

import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { formatDateTimezone } from 'libs/parsers'
import { Spacer, Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const notCancellableMessage = 'Cette réservation n’est pas annulable'

export const CancellationDetails: React.FC = () => {
  const stock = useBookingStock()
  const offer = useBookingOffer()

  if (!stock || !offer) return null

  const { activationCode, cancellationLimitDatetime: limitDate } = stock

  let message = 'Cette réservation est annulable'
  if (limitDate) {
    message =
      new Date(limitDate) < new Date()
        ? notCancellableMessage
        : `Cette réservation peut être annulée jusqu’au ${formatDateTimezone(limitDate, false)}`
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

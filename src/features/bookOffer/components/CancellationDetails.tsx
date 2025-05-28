import React from 'react'

import { useBookingOffer } from 'features/bookOffer/helpers/useBookingOffer'
import { useBookingStock } from 'features/bookOffer/helpers/useBookingStock'
import { formatDateTimezone } from 'libs/parsers/formatDates'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

const NOT_CANCELLABLE_MESSAGE =
  'En confirmant la réservation, j’accepte son exécution immédiate et renonce à mon droit de rétractation. Une confirmation de cet accord me sera envoyée par email.'

export const CancellationDetails: React.FC = () => {
  const stock = useBookingStock()
  const offer = useBookingOffer()

  if (!stock || !offer) return null

  const { activationCode, cancellationLimitDatetime: limitDate } = stock

  let message = 'Cette réservation est annulable'
  if (limitDate) {
    message =
      new Date(limitDate) < new Date()
        ? NOT_CANCELLABLE_MESSAGE
        : `Cette réservation peut être annulée jusqu’au ${formatDateTimezone(limitDate, false)}`
  }

  if (offer.isDigital && !!activationCode) {
    message = NOT_CANCELLABLE_MESSAGE
  }

  return (
    <ViewGap gap={2}>
      <Typo.Title4 {...getHeadingAttrs(2)}>Conditions d’annulation</Typo.Title4>
      <Typo.BodyAccentXs>{message}</Typo.BodyAccentXs>
    </ViewGap>
  )
}

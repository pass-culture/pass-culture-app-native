import { t } from '@lingui/macro'
import React from 'react'

import { useAppSettings } from 'features/auth/settings'
import { useBookingOffer, useBookingStock } from 'features/bookOffer/pages/BookingOfferWrapper'
import { formatToFrenchDate, formatToHour } from 'libs/parsers/formatDates'
import { Spacer, Typo } from 'ui/theme'

export const formatDate = (limitDate: string): string => {
  const limit = new Date(limitDate)
  return `${formatToFrenchDate(limit)}, ${formatToHour(limit)}`
}

export const CancellationDetails: React.FC = () => {
  const stock = useBookingStock()
  const offer = useBookingOffer()
  const { data: settings } = useAppSettings()

  if (!stock || !offer) return <React.Fragment />

  const { activationCode, cancellationLimitDatetime: limitDate } = stock

  let message = t`Cette réservation est annulable`
  if (limitDate) {
    message =
      new Date(limitDate) < new Date()
        ? notCancellableMessage
        : t({
            id: "réservation annulable jusqu'au",
            values: { date: formatDate(limitDate) },
            message: 'Cette réservation peut être annulée jusqu’au {date}',
          })
  }
  // if "autoActivateDigitalBookings" is set, any digital booking with activationCode will be
  // automatically activated. As a result, they are not cancellable.
  if (settings?.autoActivateDigitalBookings && offer.isDigital && !!activationCode) {
    message = notCancellableMessage
  }

  return (
    <React.Fragment>
      <Typo.Title4>{t`Conditions d'annulation`}</Typo.Title4>
      <Spacer.Column numberOfSpaces={2} />
      <Typo.Caption>{message}</Typo.Caption>
    </React.Fragment>
  )
}

const notCancellableMessage = t`Cette réservation n’est pas annulable`

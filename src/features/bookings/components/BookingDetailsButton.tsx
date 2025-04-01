import React from 'react'

import { BookingProperties } from 'features/bookings/types'
import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'

export type BookingDetailsButtonProps = {
  onCancel?: () => void
  onTerminate?: () => void
  fullWidth?: boolean
  testID?: string
}

export const BookingDetailsButton = ({
  testID,
  hasActivationCode,
  onTerminate,
  fullWidth,
  onCancel,
  isFreeOfferToArchive,
}: BookingDetailsButtonProps & {
  hasActivationCode: BookingProperties['hasActivationCode']
  isFreeOfferToArchive: boolean
}) => {
  if (hasActivationCode) {
    return (
      <ButtonSecondary
        testID={testID}
        wording="Terminer"
        onPress={onTerminate}
        fullWidth={fullWidth}
      />
    )
  }
  if (!isFreeOfferToArchive) {
    return (
      <ButtonSecondary
        testID={testID}
        wording="Annuler ma réservation"
        onPress={onCancel}
        fullWidth={fullWidth}
      />
    )
  }
  return null
}

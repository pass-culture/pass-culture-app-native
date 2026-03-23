import React from 'react'

import { BookingProperties } from 'features/bookings/types'
import { Button } from 'ui/designSystem/Button/Button'

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
      <Button
        testID={testID}
        wording="Terminer"
        onPress={onTerminate}
        fullWidth={fullWidth}
        variant="secondary"
        color="brand"
      />
    )
  }
  if (!isFreeOfferToArchive) {
    return (
      <Button
        testID={testID}
        wording="Annuler ma réservation"
        onPress={onCancel}
        fullWidth={fullWidth}
        variant="secondary"
        color="brand"
      />
    )
  }
  return null
}

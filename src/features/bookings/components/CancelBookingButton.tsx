import React from 'react'

import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'

interface CancelButtonProps {
  onCancel?: () => void
  fullWidth?: boolean
}

export const CancelBookingButton = ({ onCancel, fullWidth = false }: CancelButtonProps) => {
  return (
    <ButtonSecondary wording="Annuler ma réservation" onPress={onCancel} fullWidth={fullWidth} />
  )
}

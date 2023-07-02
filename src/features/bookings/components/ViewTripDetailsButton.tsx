import React from 'react'

import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'

export interface ViewTripDetailsButtonProps {
  onClick?: () => void
  fullWidth?: boolean
}

export const ViewTripDetailsButton = ({
  onClick,
  fullWidth = false,
}: ViewTripDetailsButtonProps) => {
  return (
    <ButtonSecondary
      wording="Afficher les détails du voyage"
      onPress={onClick}
      fullWidth={fullWidth}
    />
  )
}

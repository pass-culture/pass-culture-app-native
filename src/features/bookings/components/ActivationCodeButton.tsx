import React from 'react'

import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'

interface ActivationCodeButtonProps {
  onTerminate?: () => void
  fullWidth?: boolean
}

export const ActivationCodeButton = ({
  onTerminate,
  fullWidth = false,
}: ActivationCodeButtonProps) => {
  return <ButtonSecondary wording="Terminer" onPress={onTerminate} fullWidth={fullWidth} />
}

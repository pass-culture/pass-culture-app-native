import React from 'react'

import { ButtonSecondary } from 'ui/components/buttons/ButtonSecondary'

export interface ActivationCodeButtonProps {
  onTerminate?: () => void
  fullWidth?: boolean
}

export const ActivationCodeButton = ({ onTerminate, fullWidth }: ActivationCodeButtonProps) => {
  return <ButtonSecondary wording="Terminer" onPress={onTerminate} fullWidth={fullWidth} />
}

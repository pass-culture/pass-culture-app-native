import React, { FunctionComponent } from 'react'

import { AgeButtonContainer } from 'features/onboarding/components/AgeButtonContainer'
import { AgeButtonProps } from 'features/onboarding/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'

export const AgeButton: FunctionComponent<AgeButtonProps> = ({
  dense,
  Icon,
  navigateTo,
  accessibilityLabel,
  enableNavigate,
  onBeforeNavigate,
  children,
}) => {
  return (
    <InternalTouchableLink
      enableNavigate={enableNavigate}
      onBeforeNavigate={onBeforeNavigate}
      navigateTo={navigateTo}
      accessibilityLabel={accessibilityLabel}>
      <AgeButtonContainer dense={dense} LeftIcon={Icon}>
        {children}
      </AgeButtonContainer>
    </InternalTouchableLink>
  )
}

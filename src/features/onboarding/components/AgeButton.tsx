import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { AgeButtonProps } from 'features/onboarding/types'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { getSpacing } from 'ui/theme'

export const AgeButton: FunctionComponent<AgeButtonProps> = ({
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
      <GenericBanner LeftIcon={Icon}>
        <PaddingVertical>{children}</PaddingVertical>
      </GenericBanner>
    </InternalTouchableLink>
  )
}

const PaddingVertical = styled.View({
  paddingVertical: getSpacing(6),
})

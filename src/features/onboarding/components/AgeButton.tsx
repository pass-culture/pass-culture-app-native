import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

type AgeButtonProps = {
  accessibilityLabel: string
  dense?: boolean
  icon?: FunctionComponent<IconInterface>
  navigateTo: InternalNavigationProps['navigateTo']
  onBeforeNavigate?: () => void
}

export const AgeButton: FunctionComponent<AgeButtonProps> = ({
  dense,
  icon,
  navigateTo,
  accessibilityLabel,
  onBeforeNavigate,
  children,
}) => {
  return (
    <InternalTouchableLink
      onBeforeNavigate={onBeforeNavigate}
      navigateTo={navigateTo}
      {...accessibilityAndTestId(accessibilityLabel)}>
      <StyledBanner dense={dense} LeftIcon={icon}>
        {children}
      </StyledBanner>
    </InternalTouchableLink>
  )
}

const StyledBanner = styled(GenericBanner)<{ dense?: boolean }>(({ dense }) => ({
  paddingVertical: getSpacing(dense ? 4 : 6),
}))

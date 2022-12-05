import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { GenericBanner } from 'ui/components/ModuleBanner/GenericBanner'
import { TouchableLink } from 'ui/components/touchableLink/TouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { IconInterface } from 'ui/svg/icons/types'
import { getSpacing } from 'ui/theme'

type AgeButtonProps = {
  dense?: boolean
  icon?: FunctionComponent<IconInterface>
  navigateTo: InternalNavigationProps['navigateTo']
  onBeforeNavigate?: () => void
}

export const AgeButton: FunctionComponent<AgeButtonProps> = ({
  dense,
  icon,
  navigateTo,
  onBeforeNavigate,
  children,
}) => {
  return (
    <TouchableLink onBeforeNavigate={onBeforeNavigate} navigateTo={navigateTo}>
      <StyledBanner dense={dense} LeftIcon={icon}>
        {children}
      </StyledBanner>
    </TouchableLink>
  )
}

const StyledBanner = styled(GenericBanner)<{ dense?: boolean }>(({ dense }) => ({
  paddingVertical: getSpacing(dense ? 4 : 6),
}))

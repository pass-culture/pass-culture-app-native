// IconWithValidation.tsx
import React from 'react'
import styled from 'styled-components/native'

import { ValidationMark as DefaultValidationMark } from 'ui/components/ValidationMark'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { getSpacing, Spacer } from 'ui/theme'

interface Props {
  Icon: React.FC<AccessibleIcon>
  isAccessible: boolean
}

export const AccessibilityFrame: React.FC<Props> = ({ Icon, isAccessible }) => {
  const StyledIcon = styled(Icon).attrs(({ theme }) => ({
    color: theme.designSystem.color.icon.default,
    size: theme.icons.sizes.small,
  }))``

  return (
    <Frame accessibilityHidden>
      <Spacer.Flex />
      <StyledIcon />
      <Spacer.Flex />
      <ValidationContainer>
        <ValidationMark isValid={isAccessible} />
      </ValidationContainer>
    </Frame>
  )
}

const Frame = styled.View(({ theme }) => ({
  height: getSpacing(12),
  width: getSpacing(12),
  alignItems: 'center',
  borderColor: theme.colors.greyMedium,
  borderRadius: theme.borderRadius.radius,
  borderWidth: 1,
}))

const ValidationContainer = styled.View({
  position: 'absolute',
  bottom: -getSpacing(2),
})

const ValidationMark = styled(DefaultValidationMark).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

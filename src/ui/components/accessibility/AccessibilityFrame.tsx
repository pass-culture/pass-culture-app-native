// IconWithValidation.tsx
import React from 'react'
import styled from 'styled-components/native'

import { ValidationMark as DefaultValidationMark } from 'ui/components/ValidationMark'
import { AccessibleIcon } from 'ui/svg/icons/types'
import { Spacer } from 'ui/theme'

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
  height: theme.designSystem.size.spacing.xxxxl,
  width: theme.designSystem.size.spacing.xxxxl,
  alignItems: 'center',
  borderColor: theme.designSystem.color.border.default,
  borderRadius: theme.designSystem.size.borderRadius.m,
  borderWidth: 1,
}))

const ValidationContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  bottom: -theme.designSystem.size.spacing.s,
}))

const ValidationMark = styled(DefaultValidationMark).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

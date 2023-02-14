import React from 'react'
import styled from 'styled-components/native'

import { StepButtonState, StepConfig } from 'features/identityCheck/types'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { Validate as DefaultValidate } from 'ui/svg/icons/Validate'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  step: StepConfig
  state: StepButtonState
  navigateTo?: InternalNavigationProps['navigateTo']
  onPress?: () => void
}

export const StepButton = ({ step, state, navigateTo, onPress }: Props) => {
  const { icon: Icon, label } = step

  // we need to update opacity inside component definition since it does not update properly in BaseTouchableLink
  const StyledTouchableLink = styled(BaseTouchableLink)({
    opacity: state === 'disabled' ? 0.5 : 1,
  })

  const iconLabel = state === StepButtonState.COMPLETED ? 'Complété' : 'Non complété'
  const accessibilityLabel = `${label} ${iconLabel}`

  return (
    <StyledTouchableLink
      navigateTo={navigateTo}
      onBeforeNavigate={onPress}
      disabled={state !== 'current'}
      accessibilityLabel={accessibilityLabel}>
      <IconContainer>
        <Icon />
      </IconContainer>
      <Typo.ButtonText>{label}</Typo.ButtonText>
      <CompletionContainer>
        <Validate
          isCompleted={state === StepButtonState.COMPLETED}
          {...accessibilityAndTestId(iconLabel)}
        />
      </CompletionContainer>
    </StyledTouchableLink>
  )
}

const BaseTouchableLink = styled(InternalTouchableLink)(({ theme }) => ({
  height: getSpacing(24),
  marginTop: getSpacing(2),
  width: '100%',
  backgroundColor: theme.colors.white,
  borderRadius: theme.borderRadius.radius,
  flexDirection: 'row',
  alignItems: 'center',
}))

const IconContainer = styled.View({ padding: getSpacing(4) })

const CompletionContainer = styled.View({
  flex: 1,
  alignItems: 'flex-end',
  paddingHorizontal: getSpacing(2),
})

const Validate = styled(DefaultValidate).attrs<{ isCompleted: boolean }>(
  ({ theme, isCompleted }) => ({
    color: isCompleted ? theme.colors.greenValid : theme.colors.transparent,
  })
)<{ isCompleted: boolean }>``

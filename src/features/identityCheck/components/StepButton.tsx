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

  const iconLabel = state === StepButtonState.COMPLETED ? 'Complété' : 'Non complété'
  const accessibilityLabel = `${label} ${iconLabel}`

  const TouchableComponent =
    state === StepButtonState.CURRENT ? EnabledTouchableLink : DisabledTouchableLink

  return (
    <TouchableComponent
      navigateTo={navigateTo}
      onBeforeNavigate={onPress}
      disabled={state !== 'current'}
      accessibilityLabel={accessibilityLabel}>
      <IconContainer>
        <Icon />
      </IconContainer>
      <StyledButtonText state={state}>{label}</StyledButtonText>
      <CompletionContainer>
        <Validate
          isCompleted={state === StepButtonState.COMPLETED}
          {...accessibilityAndTestId(iconLabel)}
        />
      </CompletionContainer>
    </TouchableComponent>
  )
}

const BaseTouchableLink = styled(InternalTouchableLink)(({ theme }) => ({
  marginTop: getSpacing(2),
  backgroundColor: theme.colors.white,
  borderRadius: theme.borderRadius.radius,
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: '1px',
}))

const EnabledTouchableLink = styled(BaseTouchableLink)(({ theme }) => ({
  height: getSpacing(23),
  width: '100%',
  borderColor: theme.colors.greySemiDark,
}))

const DisabledTouchableLink = styled(BaseTouchableLink)(({ theme }) => ({
  height: getSpacing(22),
  width: '98%',
  borderColor: theme.colors.greyMedium,
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

const StyledButtonText = styled(Typo.ButtonText)<{ state: StepButtonState }>(
  ({ state, theme }) => ({
    color: state === StepButtonState.CURRENT ? theme.colors.black : theme.colors.greySemiDark,
  })
)

import React from 'react'
import styled from 'styled-components/native'

import { StepButtonState, StepConfig } from 'features/identityCheck/types'
import { InternalTouchableLink } from 'ui/components/touchableLink/InternalTouchableLink'
import { InternalNavigationProps } from 'ui/components/touchableLink/types'
import { getSpacing, Typo } from 'ui/theme'

interface Props {
  step: StepConfig
  state: StepButtonState
  navigateTo?: InternalNavigationProps['navigateTo']
  onPress?: () => void
}

export const StepButton = ({ step, state, navigateTo, onPress }: Props) => {
  const label = step.label
  const Icon = step.icon[state]

  const iconLabel = state === StepButtonState.COMPLETED ? 'Complété' : 'Non complété'
  const accessibilityLabel = `${label} ${iconLabel}`

  const TouchableComponent = touchableComponent[state]

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

const CurrentTouchableLink = styled(BaseTouchableLink)(({ theme }) => ({
  height: getSpacing(23),
  width: '100%',
  borderColor: theme.colors.greySemiDark,
}))

const DisabledTouchableLink = styled(BaseTouchableLink)(({ theme }) => ({
  height: getSpacing(22),
  width: '98%',
  borderColor: theme.colors.greyMedium,
}))

const CompletedTouchableLink = styled(DisabledTouchableLink)(({ theme }) => ({
  borderColor: theme.colors.greyLight,
  borderWidth: '2px',
}))

const touchableComponent = {
  [StepButtonState.COMPLETED]: CompletedTouchableLink,
  [StepButtonState.CURRENT]: CurrentTouchableLink,
  [StepButtonState.DISABLED]: DisabledTouchableLink,
}

const IconContainer = styled.View({ padding: getSpacing(4) })

const StyledButtonText = styled(Typo.ButtonText)<{ state: StepButtonState }>(
  ({ state, theme }) => ({
    color: state === StepButtonState.CURRENT ? theme.colors.black : theme.colors.greySemiDark,
  })
)

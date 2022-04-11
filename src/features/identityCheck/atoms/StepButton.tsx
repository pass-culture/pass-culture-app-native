import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { StepConfig } from 'features/identityCheck/types'
import { AllNavParamList } from 'features/navigation/RootNavigator'
import { accessibilityAndTestId } from 'libs/accessibilityAndTestId'
import { Validate as DefaultValidate } from 'ui/svg/icons/Validate'
import { getSpacing, Typo } from 'ui/theme'
import { TouchableLink } from 'ui/web/link/TouchableLink'
import { To } from 'ui/web/link/types'

export type StepButtonState = 'completed' | 'current' | 'disabled'

interface Props {
  step: StepConfig
  state: StepButtonState
  to?: To<AllNavParamList, keyof AllNavParamList>
  onPress?: () => void
}

export const StepButton = ({ step, state, to, onPress }: Props) => {
  const { icon: Icon, label } = step

  return (
    <StyledTouchableLink
      to={to}
      onPress={onPress}
      disabled={state !== 'current'}
      state={state}
      {...accessibilityAndTestId(undefined, label)}>
      <IconContainer>
        <Icon />
      </IconContainer>
      <Typo.ButtonText>{label}</Typo.ButtonText>
      <CompletionContainer>
        <Validate
          isCompleted={state === 'completed'}
          {...accessibilityAndTestId(
            state === 'completed' ? t`Complété` : '',
            state === 'completed' ? 'StepCompleted' : 'StepNotCompleted'
          )}
        />
      </CompletionContainer>
    </StyledTouchableLink>
  )
}

const StyledTouchableLink = styled(TouchableLink)<{
  disabled: boolean
  state: StepButtonState
}>(({ state, theme }) => ({
  height: getSpacing(24),
  marginTop: getSpacing(6),
  width: '100%',
  backgroundColor: theme.colors.white,
  borderRadius: theme.borderRadius.radius,
  opacity: state === 'disabled' ? 0.5 : 1,
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
    color: isCompleted ? theme.colors.greenLight : theme.colors.transparent,
  })
)<{ isCompleted: boolean }>``

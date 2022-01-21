import React from 'react'
import styled, { useTheme } from 'styled-components/native'

import { StepConfig } from 'features/identityCheck/types'
import { accessibilityAndTestId } from 'tests/utils'
import { Validate } from 'ui/svg/icons/Validate'
import { getSpacing, Typo } from 'ui/theme'

export type StepButtonState = 'completed' | 'current' | 'disabled'

interface Props {
  step: StepConfig
  state: StepButtonState
  onPress?: () => void
}

export const StepButton = ({ step, state, onPress }: Props) => {
  const { colors } = useTheme()
  const { icon: Icon, label } = step

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={state !== 'current'}
      state={state}
      {...accessibilityAndTestId(label)}>
      <IconContainer>
        <Icon size={getSpacing(10)} />
      </IconContainer>
      <Typo.ButtonText>{label}</Typo.ButtonText>
      <CompletionContainer>
        <Validate
          color={state === 'completed' ? colors.greenLight : colors.transparent}
          {...accessibilityAndTestId(state === 'completed' ? 'StepCompleted' : 'StepNotCompleted')}
        />
      </CompletionContainer>
    </TouchableOpacity>
  )
}

const TouchableOpacity = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))<{ disabled: boolean; state: StepButtonState }>(({ state, theme }) => ({
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

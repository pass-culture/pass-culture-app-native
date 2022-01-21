import React from 'react'
import styled from 'styled-components/native'

import { StepConfig } from 'features/identityCheck/types'
import { accessibilityAndTestId } from 'tests/utils'
import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { BorderRadiusEnum } from 'ui/theme/grid'

export type StepButtonState = 'completed' | 'current' | 'disabled'

interface Props {
  step: StepConfig
  state: StepButtonState
  onPress?: () => void
}

export const StepButton = ({ step, state, onPress }: Props) => {
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
          color={state === 'completed' ? ColorsEnum.GREEN_LIGHT : ColorsEnum.TRANSPARENT}
          {...accessibilityAndTestId(state === 'completed' ? 'StepCompleted' : 'StepNotCompleted')}
        />
      </CompletionContainer>
    </TouchableOpacity>
  )
}

const TouchableOpacity = styled.TouchableOpacity.attrs(({ theme }) => ({
  activeOpacity: theme.activeOpacity,
}))<{ disabled: boolean; state: StepButtonState }>((props) => ({
  height: getSpacing(24),
  marginTop: getSpacing(6),
  width: '100%',
  backgroundColor: ColorsEnum.WHITE,
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  opacity: props.state === 'disabled' ? 0.5 : 1,
  flexDirection: 'row',
  alignItems: 'center',
}))

const IconContainer = styled.View({ padding: getSpacing(4) })

const CompletionContainer = styled.View({
  flex: 1,
  alignItems: 'flex-end',
  paddingHorizontal: getSpacing(2),
})

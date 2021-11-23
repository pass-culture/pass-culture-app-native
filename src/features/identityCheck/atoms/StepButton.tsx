import React from 'react'
import styled from 'styled-components/native'

import { StepConfig } from 'features/identityCheck/types'
import { Validate } from 'ui/svg/icons/Validate'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'
import { ACTIVE_OPACITY } from 'ui/theme/colors'
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
    <Button activeOpacity={ACTIVE_OPACITY} onPress={onPress} disabled={state === 'disabled'}>
      <IconContainer>
        <Icon size={getSpacing(10)} />
      </IconContainer>
      <Typo.ButtonText>{label}</Typo.ButtonText>
      <CompletionContainer>
        <Validate
          size={getSpacing(6)}
          color={state === 'completed' ? ColorsEnum.GREEN_LIGHT : ColorsEnum.TRANSPARENT}
        />
      </CompletionContainer>
    </Button>
  )
}

const Button = styled.TouchableOpacity<{ disabled: boolean }>((props) => ({
  height: getSpacing(24),
  marginTop: getSpacing(6),
  width: '100%',
  backgroundColor: ColorsEnum.WHITE,
  borderRadius: BorderRadiusEnum.BORDER_RADIUS,
  opacity: props.disabled ? 0.5 : 1,
  flexDirection: 'row',
  alignItems: 'center',
}))

const IconContainer = styled.View({ padding: getSpacing(4) })

const CompletionContainer = styled.View({
  flex: 1,
  alignItems: 'flex-end',
  paddingHorizontal: getSpacing(2),
})

import React from 'react'
import styled from 'styled-components/native'

import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

import { ChoiceBloc } from './ChoiceBloc'

interface Props {
  hour: string
  price: string
  selected: boolean
  onPress: () => void
  testID: string
}

export const HourChoice: React.FC<Props> = ({ hour, price, selected, onPress, testID }) => {
  const textColor = selected ? ColorsEnum.WHITE : ColorsEnum.BLACK
  return (
    <ChoiceBloc onPress={onPress} testID={testID} selected={selected}>
      <Container>
        <Typo.ButtonText testID={`${testID}-hour`} color={textColor}>
          {hour}
        </Typo.ButtonText>

        <Typo.Caption testID={`${testID}-price`} color={textColor}>
          {price}
        </Typo.Caption>
      </Container>
    </ChoiceBloc>
  )
}

const Container = styled.View({
  paddingVertical: getSpacing(5),
  alignItems: 'center',
})

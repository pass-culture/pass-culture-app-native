import React from 'react'

import { ColorsEnum, Typo } from 'ui/theme'

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
      <React.Fragment>
        <Typo.ButtonText testID={`${testID}-hour`} color={textColor}>
          {hour}
        </Typo.ButtonText>

        <Typo.Caption testID={`${testID}-price`} color={textColor}>
          {price}
        </Typo.Caption>
      </React.Fragment>
    </ChoiceBloc>
  )
}

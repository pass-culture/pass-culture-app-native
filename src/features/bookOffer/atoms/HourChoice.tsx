import { t } from '@lingui/macro'
import React from 'react'
import styled from 'styled-components/native'

import { _ } from 'libs/i18n'
import { ColorsEnum, getSpacing, Typo } from 'ui/theme'

import { ChoiceBloc } from './ChoiceBloc'

const getTextColor = (selected: boolean, disabled: boolean) => {
  if (selected) return ColorsEnum.WHITE
  if (disabled) return ColorsEnum.GREY_DARK
  return ColorsEnum.BLACK
}

interface Props {
  hour: string
  price: string
  selected: boolean
  onPress: () => void
  testID: string
  isBookable: boolean
}

export const HourChoice: React.FC<Props> = ({
  hour,
  price,
  selected,
  onPress,
  testID,
  isBookable,
}) => {
  const textColor = getTextColor(selected, !isBookable)

  return (
    <ChoiceBloc onPress={onPress} testID={testID} selected={selected} disabled={!isBookable}>
      <Container>
        <Typo.ButtonText testID={`${testID}-hour`} color={textColor}>
          {hour}
        </Typo.ButtonText>

        <Typo.Caption testID={`${testID}-price`} color={textColor}>
          {isBookable ? price : _(t`épuisé`)}
        </Typo.Caption>
      </Container>
    </ChoiceBloc>
  )
}

const Container = styled.View({
  paddingVertical: getSpacing(5),
  alignItems: 'center',
})

import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { MapPin } from 'ui/svg/icons/MapPin'
import { getShadow, getSpacing, Typo } from 'ui/theme'

type Props = {
  count: number
}

const NUMBER_LEFT_POSITION = 15
const NUMBER_TOP_POSITION = -2
const MAPPIN_SIZE = 32
const COUNTER_HEIGHT = 16 + 2 // +2 is the top position
const COUNTER_WIDTH = 27

export const MapPinWithCounter: FunctionComponent<Props> = ({ count }) => {
  return (
    <Container>
      <MapPin />

      <NumberContainer testID="numberContainer">
        <Typo.Caption>{count < 100 ? String(count) : '99+'}</Typo.Caption>
      </NumberContainer>
    </Container>
  )
}

const Container = styled.View({
  height: MAPPIN_SIZE + COUNTER_HEIGHT / 2,
  width: MAPPIN_SIZE / 2 + COUNTER_WIDTH,
  justifyContent: 'flex-end',
})

const NumberContainer = styled.View(({ theme }) => ({
  position: 'absolute',
  paddingVertical: getSpacing(0.5),
  paddingHorizontal: getSpacing(1),
  borderRadius: theme.borderRadius.button,
  backgroundColor: theme.colors.white,
  left: NUMBER_LEFT_POSITION,
  top: NUMBER_TOP_POSITION,
  ...getShadow({
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: getSpacing(1.5),
    shadowColor: theme.colors.black,
    shadowOpacity: 0.15,
  }),
}))

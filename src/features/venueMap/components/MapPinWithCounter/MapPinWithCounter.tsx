import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { MapPin } from 'ui/svg/icons/MapPin'
import { getShadow, getSpacing, TypoDS } from 'ui/theme'

type Props = {
  count: number
}

const NUMBER_LEFT_POSITION = 15
const NUMBER_TOP_POSITION = -2
const MAP_PIN_SIZE = 32
const COUNTER_BLOCK_HEIGHT = 16 - NUMBER_TOP_POSITION
const COUNTER_BLOCK_WIDTH = 27

export const MapPinWithCounter: FunctionComponent<Props> = ({ count }) => {
  return (
    <Container>
      <MapPin />

      <NumberContainer testID="numberContainer">
        <TypoDS.BodyAccentXs>{count < 100 ? String(count) : '99+'}</TypoDS.BodyAccentXs>
      </NumberContainer>
    </Container>
  )
}

const Container = styled.View({
  height: MAP_PIN_SIZE + COUNTER_BLOCK_HEIGHT / 2,
  width: MAP_PIN_SIZE + COUNTER_BLOCK_WIDTH / 2,
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

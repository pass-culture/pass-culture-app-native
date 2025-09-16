import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

type Props = {
  index: number
  animValue: number
}

const SMALL_DOT_SIZE = 4
const BIG_DOT_SIZE = SMALL_DOT_SIZE + 4

export const CarouselDot: React.FunctionComponent<Props> = ({ animValue, index }) => {
  const animStyle = {
    backgroundColor: undefined,
    width: animValue + index,
    height: animValue,
    margin: animValue,
  }

  return <Dot testID="carousel-dot" style={animStyle} />
}

const Dot = styled(View)(({ theme }) => ({
  borderRadius: BIG_DOT_SIZE,
  backgroundColor: theme.designSystem.color.background.inverted,
  overflow: 'hidden',
}))

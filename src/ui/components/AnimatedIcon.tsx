import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'

import { IconInterface } from '../svg/icons/types'
import { ColorsEnum } from '../theme/colors'

interface Props {
  Icon: React.FC<IconInterface>
  transition: Animated.AnimatedInterpolation<string | number>
  size: number
  initialColor: ColorsEnum
  finalColor: ColorsEnum
  testID?: string
}

export const AnimatedIcon: React.FC<Props> = ({
  Icon,
  transition,
  testID,
  size,
  initialColor,
  finalColor,
}) => {
  const oppositeOpacity = transition.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  })
  return (
    <Container size={size}>
      <IconContainer testID="initial-icon-container" style={{ opacity: oppositeOpacity }}>
        <Icon testID={testID} size={size} color={initialColor} />
      </IconContainer>
      <IconContainer testID="final-icon-container" style={{ opacity: transition }}>
        <Icon size={size} color={finalColor} testID={testID ? `final-${testID}` : undefined} />
      </IconContainer>
    </Container>
  )
}
const IconContainer = styled(Animated.View)({ position: 'absolute' })
const Container = styled.View<{ size: number }>(({ size }) => ({
  height: size,
  width: size,
}))

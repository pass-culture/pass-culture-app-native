import React from 'react'
import GestureRecognizer from 'react-native-swipe-gestures'
import styled from 'styled-components/native'

const CONFIG = {
  velocityThreshold: 0.03,
  directionalOffsetThreshold: 400,
  gestureIsClickThreshold: 0.1,
}

type Props = Omit<GestureRecognizer['props'], 'config'>

export const TutorialSwiper: React.FunctionComponent<Props> = (props) => {
  return (
    <StyledGestureRecognizer {...props} config={CONFIG}>
      {props.children}
    </StyledGestureRecognizer>
  )
}

const StyledGestureRecognizer = styled(GestureRecognizer)({
  flexGrow: 1,
})

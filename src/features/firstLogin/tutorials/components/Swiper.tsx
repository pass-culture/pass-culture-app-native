import React from 'react'
import GestureRecognizer from 'react-native-swipe-gestures'

const CONFIG = {
  velocityThreshold: 0.03,
  directionalOffsetThreshold: 400,
  gestureIsClickThreshold: 0.1,
}

type Props = Omit<GestureRecognizer['props'], 'config'>

export const Swiper: React.FunctionComponent<Props> = (props) => {
  return (
    <GestureRecognizer {...props} config={CONFIG}>
      {props.children}
    </GestureRecognizer>
  )
}

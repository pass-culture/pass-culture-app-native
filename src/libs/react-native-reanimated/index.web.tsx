import { useIsFocused } from '@react-navigation/native'
import React from 'react'
import { View as RNView, ViewProps } from 'react-native'
import ReanimatedDefault from 'react-native-reanimated'

export * from 'react-native-reanimated'

const AnimatedView: React.FC<ViewProps> = (props) => {
  const isFocused = useIsFocused()
  return isFocused ? <ReanimatedDefault.View {...props} /> : <RNView {...props} />
}

const Animated = {
  ...ReanimatedDefault,
  View: AnimatedView,
}

export default Animated

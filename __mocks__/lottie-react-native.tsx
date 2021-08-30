import ActualLottieView from 'lottie-react-native'
import React from 'react'
import { View } from 'react-native'

type Props = {
  testID: string
}

const LottieView = React.forwardRef<ActualLottieView, Props>(function LottieView(
  props,
  _forwardedRef
) {
  const displayNameForTest = `${props.testID}-Lottie-Mock`
  return <View testID={props.testID}>{displayNameForTest}</View>
})

export default LottieView

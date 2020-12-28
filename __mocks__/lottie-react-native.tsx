import React from 'react'
import { View } from "react-native"

const LottieView = ({ testID }) => {
    const displayNameForTest = `${testID}-Lottie-Mock`
    return <View testID={testID}>{displayNameForTest}</View>
} 

export default LottieView

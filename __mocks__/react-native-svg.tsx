import React from 'react'
import { Text, View } from 'react-native'

const mockReactNativeSvg = jest.genMockFromModule('react-native-svg')

const Svg = ({
  testID,
  accessibilityLabel,
  fill,
  fillColor,
  borderColor,
  width,
  height,
}: {
  testID: string
  accessibilityLabel: string
  fill: string
  fillColor: string
  borderColor: string
  width: number
  height: number
}) => {
  const displayNameForTest = `${testID}-SVG-Mock`
  return (
    <View
      // @ts-expect-error : fill, fillColor, borderColor, width, height do not exists on View, but for test purposes setting the props can be useful
      fill={fill}
      fillColor={fillColor}
      borderColor={borderColor}
      width={width}
      height={height}
      accessibilityLabel={accessibilityLabel}
      testID={testID}>
      <Text>{displayNameForTest}</Text>
    </View>
  )
}

module.exports = {
  // @ts-expect-error : the error is "Spread types may only be created from object types". Well the mock works anyway.
  ...mockReactNativeSvg,
  default: Svg,
}

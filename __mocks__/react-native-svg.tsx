import React from 'react'
import { Text, View } from 'react-native'

const mockReactNativeSvg = jest.genMockFromModule('react-native-svg')

const Svg = ({
  testID,
  fill,
  width,
  height,
}: {
  testID: string
  fill: string
  width: number
  height: number
}) => {
  const displayNameForTest = `${testID}-SVG-Mock`
  return (
    <View
      // @ts-expect-error : fill, width, height do not exists on View, but for test purposes setting the props can be useful
      fill={fill}
      width={width}
      height={height}
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

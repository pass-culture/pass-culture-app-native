import React from 'react'
import { View } from "react-native";

const mockReactNativeSvg = jest.genMockFromModule('react-native-svg')

const Svg = ({ testID, fill, width, height }) => {
    const displayNameForTest = `${testID}-SVG-Mock`
    return <View 
        // @ts-ignore : fill, width, height do not exists on View, but for test purposes setting the props can be useful
        fill={fill}
        width={width}
        height={height}
        testID={testID}>  
        {displayNameForTest}
    </View>
} 

module.exports = {
    // @ts-ignore : the error is "Spread types may only be created from object types". Well the mock works anyway.
    ...mockReactNativeSvg, 
    default: Svg,
}
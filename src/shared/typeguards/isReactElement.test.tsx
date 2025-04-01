import React, { ReactElement } from 'react'
import { Text, View } from 'react-native'

import { isReactElement } from 'shared/typeguards/isReactElement'

describe('isReactElement', () => {
  it('should return true for valid React elements', () => {
    const element: ReactElement = (
      <View>
        <Text>Test</Text>
      </View>
    )

    expect(isReactElement(element)).toEqual(true)
  })

  it('should return false for non-React elements', () => {
    const nonElement = { key: 'value' }

    expect(isReactElement(nonElement)).toEqual(false)
  })
})

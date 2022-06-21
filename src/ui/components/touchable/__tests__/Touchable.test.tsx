import React from 'react'
import { Text } from 'react-native'

import { render } from 'tests/utils'

import { Touchable } from '../Touchable'

describe('<Touchable />', () => {
  it('should render correctly', () => {
    const handleClick = jest.fn()
    const renderTouchable = render(
      <Touchable onPress={handleClick}>
        <Text>Touchable content</Text>
      </Touchable>
    )
    expect(renderTouchable).toMatchSnapshot()
  })

  it('should render correctly on custom type', () => {
    const handleClick = jest.fn()
    const renderTouchable = render(
      <Touchable type="reset" onPress={handleClick}>
        <Text>Touchable content</Text>
      </Touchable>
    )
    expect(renderTouchable).toMatchSnapshot()
  })
})

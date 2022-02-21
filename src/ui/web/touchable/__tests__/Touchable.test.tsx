import React from 'react'
import { Text } from 'react-native'

import { render } from 'tests/utils'

import { Touchable } from '../Touchable'

describe('<Touchable />', () => {
  it('should render correctly', () => {
    const renderTouchable = render(
      <Touchable>
        <Text>Touchable content</Text>
      </Touchable>
    )
    expect(renderTouchable).toMatchSnapshot()
  })
  it('should render correctly on custom type', () => {
    const renderTouchable = render(
      <Touchable type="reset">
        <Text>Touchable content</Text>
      </Touchable>
    )
    expect(renderTouchable).toMatchSnapshot()
  })
})

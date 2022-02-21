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
})

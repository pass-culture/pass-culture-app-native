import React from 'react'
import { View } from 'react-native'

import { render, screen } from 'tests/utils'

import { Step } from './Step'

describe('<Step />', () => {
  it('should render nothing', () => {
    render(
      <Step>
        <View testID="test-view" />
      </Step>
    )

    expect(screen.queryByTestId('test-view')).not.toBeOnTheScreen()
  })
})

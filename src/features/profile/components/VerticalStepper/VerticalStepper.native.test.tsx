import React from 'react'
import { View } from 'react-native'

import { render, screen } from 'tests/utils'

import { StepVariant } from './types'
import { VerticalStepper } from './VerticalStepper'

/**
 * I would like to test that icon is correctly shown, but it's pretty hard...
 */

describe('<VerticalStepper />', () => {
  it('should render custom icon component', () => {
    const customComponent = (
      <View
        testID="custom-icon-component"
        // eslint-disable-next-line react-native/no-color-literals, react-native/no-inline-styles
        style={{ width: 20, height: 20, backgroundColor: 'blue' }}
      />
    )

    render(<VerticalStepper variant={StepVariant.future} iconComponent={customComponent} />)

    expect(screen.getByTestId('custom-icon-component')).toBeTruthy()
  })
})

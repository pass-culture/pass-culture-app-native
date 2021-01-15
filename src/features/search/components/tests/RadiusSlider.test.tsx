import { render } from '@testing-library/react-native'
import React from 'react'

import { RadiusSlider } from '../RadiusSlider'

describe('RadiusSlider component', () => {
  it('should render initial radius range correctly', () => {
    const { queryByText } = render(<RadiusSlider />)
    expect(queryByText('100 km')).toBeTruthy()
  })
})

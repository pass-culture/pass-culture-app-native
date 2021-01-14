import { render } from '@testing-library/react-native'
import React from 'react'

import { RadiusSlider } from '../RadiusSlider'

describe('RadiusSlider component', () => {
  it('should render correctly', () => {
    const { toJSON, queryByText } = render(<RadiusSlider />)
    expect(toJSON()).toMatchSnapshot()
    expect(queryByText('100 km')).toBeTruthy()
  })
})

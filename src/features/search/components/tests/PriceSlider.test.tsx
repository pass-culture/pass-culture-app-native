import { render } from '@testing-library/react-native'
import React from 'react'

import { PriceSlider } from '../PriceSlider'

describe('PriceSlider component', () => {
  it('should render correctly', () => {
    const { toJSON, queryByText } = render(<PriceSlider />)
    expect(toJSON()).toMatchSnapshot()
    expect(queryByText('0 € - 300 €')).toBeTruthy()
  })
})

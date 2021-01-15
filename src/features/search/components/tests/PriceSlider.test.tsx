import { render } from '@testing-library/react-native'
import React from 'react'

import { PriceSlider } from '../PriceSlider'

describe('PriceSlider component', () => {
  it('should render initial price range correctly', () => {
    const { queryByText } = render(<PriceSlider />)
    expect(queryByText('0 € - 300 €')).toBeTruthy()
  })
})

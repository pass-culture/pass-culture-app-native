import { render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'

import { PriceSlider } from '../PriceSlider'

const mockSearchState = initialSearchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

describe('PriceSlider component', () => {
  it('should render initial price range correctly', () => {
    const { queryByText } = render(<PriceSlider />)
    expect(queryByText('0 € - 300 €')).toBeTruthy()
  })
})

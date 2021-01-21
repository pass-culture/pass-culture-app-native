import { render } from '@testing-library/react-native'
import React from 'react'

import { initialSearchState } from 'features/search/pages/reducer'

import { Price } from '../Price'

const mockSearchState = initialSearchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

describe('Price component', () => {
  it('should render initial price range correctly', () => {
    const { queryByText } = render(<Price />)
    expect(queryByText('0 € - 300 €')).toBeTruthy()
  })
})

import { render } from '@testing-library/react-native'
import React from 'react'
import { View } from 'react-native'

import { initialSearchState } from '../reducer'
import { SearchWrapper } from '../SearchWrapper'

jest.mock('libs/geolocation', () => ({
  useGeolocation: jest.fn(() => ({ latitude: 2, longitude: 40 })),
}))

const mockSearchState = initialSearchState
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

describe('Search component', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<View />, { wrapper: SearchWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})

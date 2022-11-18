import React from 'react'
import { View } from 'react-native'

import { render } from 'tests/utils'

import { SearchWrapper } from '../__mocks__/SearchWrapper'

jest.mock('libs/geolocation', () => ({
  useGeolocation: jest.fn(() => ({ latitude: 2, longitude: 40 })),
}))

describe('Search component', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<View />, { wrapper: SearchWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})

import React from 'react'
import { View } from 'react-native'

import { SearchWrapper } from 'features/search/context/__mocks__/SearchWrapper'
import { render } from 'tests/utils'

jest.mock('libs/geolocation', () => ({
  useGeolocation: jest.fn(() => ({ latitude: 2, longitude: 40 })),
}))

describe('Search component', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<View />, { wrapper: SearchWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})

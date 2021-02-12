import { render } from '@testing-library/react-native'
import React from 'react'
import { View } from 'react-native'

import { SearchWrapper } from '../SearchWrapper'

jest.mock('libs/geolocation', () => ({
  useGeolocation: jest.fn(() => ({ latitude: 2, longitude: 40 })),
}))

describe('Search component', () => {
  it('should render correctly', () => {
    const { toJSON } = render(<View />, { wrapper: SearchWrapper })
    expect(toJSON()).toMatchSnapshot()
  })
})

import React from 'react'

import { render, screen } from 'tests/utils'

import { BannedCountryError } from './BannedCountryError'

jest.mock('react-native/Libraries/Animated/createAnimatedComponent', () => {
  return function createAnimatedComponent(Component: unknown) {
    return Component
  }
})

describe('BannedCountryError', () => {
  it('should render correctly', () => {
    render(<BannedCountryError />)

    expect(screen).toMatchSnapshot()
  })
})

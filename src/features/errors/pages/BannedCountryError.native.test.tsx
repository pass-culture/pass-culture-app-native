import React from 'react'

import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { BannedCountryError } from './BannedCountryError'

jest.mock('react-native-safe-area-context', () => ({
  ...(jest.requireActual('react-native-safe-area-context') as Record<string, unknown>),
  useSafeAreaInsets: () => ({ bottom: 16, right: 16, left: 16, top: 16 }),
}))

describe('BannedCountryError', () => {
  it('should render correctly', () => {
    render(reactQueryProviderHOC(<BannedCountryError />))

    expect(screen).toMatchSnapshot()
  })
})

import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

import { SiteMapScreen } from './SiteMapScreen'

jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
    hideSuggestions: jest.fn(),
  }),
}))

describe('SiteMapScreen', () => {
  beforeEach(() => setFeatureFlags())

  it('should render correctly', async () => {
    render(reactQueryProviderHOC(<SiteMapScreen />))

    await screen.findByText('Plan du site')

    expect(screen).toMatchSnapshot()
  })
})

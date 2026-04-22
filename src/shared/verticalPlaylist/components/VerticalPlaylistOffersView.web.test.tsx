import React from 'react'

import { initialSearchState } from 'features/search/context/reducer'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen } from 'tests/utils/web'

import { VerticalPlaylistOffersView } from './VerticalPlaylistOffersView'

jest.mock('libs/firebase/analytics/analytics')

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, searchId: 'fakeSearchId' }),
}))

const mockHitsItems: Offer[] = [
  mockedAlgoliaResponse.hits[0],
  mockedAlgoliaResponse.hits[1],
  mockedAlgoliaResponse.hits[2],
]

describe('<VerticalPlaylistOffersView />', () => {
  it('should render correctly', async () => {
    const { container } = render(
      reactQueryProviderHOC(
        <VerticalPlaylistOffersView
          title="My title"
          subtitle="My subtitle"
          items={mockHitsItems}
          searchQuery="query"
          analyticsFrom="searchresults"
        />
      )
    )

    await screen.findByText('My title')

    expect(container).toMatchSnapshot()
  })

  it('should not have basic accessibility issues', async () => {
    const { container } = render(
      reactQueryProviderHOC(
        <VerticalPlaylistOffersView
          title="My title"
          subtitle="My subtitle"
          items={mockHitsItems}
          searchQuery="query"
          analyticsFrom="searchresults"
        />
      )
    )

    await screen.findByText('My title')

    await act(async () => {
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

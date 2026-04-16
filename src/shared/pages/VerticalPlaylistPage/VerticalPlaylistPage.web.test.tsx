import React from 'react'

import { useRoute } from '__mocks__/@react-navigation/native'
import { OffersModuleParameters } from 'features/home/types'
import { initialSearchState } from 'features/search/context/reducer'
import { mockedAlgoliaResponse } from 'libs/algolia/fixtures/algoliaFixtures'
import { DisplayParametersFields } from 'libs/contentful/types'
import { Offer } from 'shared/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen, checkAccessibilityFor, act } from 'tests/utils/web'

import { VerticalPlaylistPage } from './VerticalPlaylistPage'

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

useRoute.mockReturnValue({
  params: {
    module: {
      offersModuleParameters: [{} as OffersModuleParameters],
      displayParameters: {
        minOffers: 0,
        title: 'Module title',
        subtitle: 'Module subtitle',
        layout: 'two-items',
      } as DisplayParametersFields,
      moduleId: 'fakeModuleId',
      position: null,
      homeEntryId: 'fakeEntryId',
      index: 1,
    },
  },
})

jest.mock('features/home/queries/useGetOffersDataQuery', () => ({
  useGetOffersDataQuery: jest.fn(() => [{ playlistItems: mockHitsItems }]),
}))

describe('<VerticalPlaylistPage />', () => {
  it('should render correctly', async () => {
    const { container } = render(reactQueryProviderHOC(<VerticalPlaylistPage />))

    await screen.findByText('Module title')
    await screen.findByText('Module subtitle')

    expect(container).toMatchSnapshot()
  })

  it('should not have basic accessibility issues', async () => {
    const { container } = render(reactQueryProviderHOC(<VerticalPlaylistPage />))

    await act(async () => {
      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })
})

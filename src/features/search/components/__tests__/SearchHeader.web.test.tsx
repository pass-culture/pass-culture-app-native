import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import waitForExpect from 'wait-for-expect'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnum } from 'api/gen'
import { SearchHeader } from 'features/search/components/SearchHeader'
import { LocationType } from 'features/search/enums'
import { initialSearchState } from 'features/search/pages/reducer'
import { SearchState } from 'features/search/types'
import { SuggestedVenue } from 'libs/venue'
import { mockedSuggestedVenues } from 'libs/venue/fixtures/mockedSuggestedVenues'
import { fireEvent, render, superFlushWithAct } from 'tests/utils/web'

const venue: SuggestedVenue = mockedSuggestedVenues[0]

const mockSearchState = initialSearchState
const mockStagedSearchState: SearchState = {
  ...initialSearchState,
  offerCategories: [SearchGroupNameEnum.CINEMA],
  locationFilter: { locationType: LocationType.VENUE, venue },
  priceRange: [0, 20],
}

const mockDispatch = jest.fn()
const mockStagedDispatch = jest.fn()
jest.mock('features/search/pages/SearchWrapper', () => ({
  useSearch: () => ({ searchState: mockSearchState, dispatch: mockDispatch }),
  useStagedSearch: () => ({ searchState: mockStagedSearchState, dispatch: mockStagedDispatch }),
}))
jest.mock('libs/analytics')

const mockSettings = {
  appEnableSearchHomepageRework: false,
}

jest.mock('features/auth/settings', () => ({
  useAppSettings: jest.fn(() => ({
    data: mockSettings,
  })),
}))

describe('SearchHeader component', () => {
  const searchInputID = uuidv4()

  it('should redirect to new search page if search enable rework feature flag is activated and focus on search input', async () => {
    mockSettings.appEnableSearchHomepageRework = true
    const { getByPlaceholderText } = render(<SearchHeader searchInputID={searchInputID} />)
    const searchInput = getByPlaceholderText('Offre, artiste...')

    fireEvent.focus(searchInput)
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(navigate).toBeCalledTimes(1)
    })
    expect(navigate).toBeCalledWith('SearchDetails')
  })

  it('should not redirect to new search page if search enable rework feature flag is not activated and focus on search input', async () => {
    mockSettings.appEnableSearchHomepageRework = false
    const { getByPlaceholderText } = render(<SearchHeader searchInputID={searchInputID} />)
    const searchInput = getByPlaceholderText('Offre, artiste...')

    fireEvent.focus(searchInput)
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(navigate).not.toBeCalled()
    })
  })
})

import React from 'react'

import { useNavigationState } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/context/reducer'
import { SearchFilter } from 'features/search/pages/SearchFilter/SearchFilter'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render, screen, waitFor } from 'tests/utils/web'

jest.mock('libs/firebase/firestore/featureFlags/useFeatureFlag')

useNavigationState.mockImplementation(() => [{ name: 'SearchFilter' }])

const mockData = PLACEHOLDER_DATA
jest.mock('libs/subcategories/useSubcategories', () => ({
  useSubcategories: () => ({
    data: mockData,
  }),
}))

const mockHasNextPage = true
const mockFetchNextPage = jest.fn()
jest.mock('features/search/api/useSearchResults/useSearchResults', () => ({
  useSearchResults: () => ({
    data: mockData,
    hits: [],
    nbHits: 0,
    isFetching: false,
    isLoading: false,
    hasNextPage: mockHasNextPage,
    fetchNextPage: mockFetchNextPage,
    isFetchingNextPage: false,
  }),
}))

const mockSearchState = initialSearchState
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: jest.fn(),
  }),
}))

jest.mock('libs/firebase/analytics/analytics')

describe('<SearchFilter/>', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = renderSearchFilter()

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })

  it('should display back button on header', async () => {
    renderSearchFilter()

    await act(async () => {}) // fixes 3 warnings "An update to %s inside a test was not wrapped in act" for LocationModal, PriceModal and DatesHoursModal

    await waitFor(() => {
      expect(screen.getByTestId('Revenir en arrière')).toBeInTheDocument()
    })
  })

  it('should not display close button on header', async () => {
    renderSearchFilter()

    await act(async () => {}) // fixes 3 warnings "An update to %s inside a test was not wrapped in act" for LocationModal, PriceModal and DatesHoursModal

    await waitFor(() => {
      expect(screen.queryByTestId('Fermer')).not.toBeInTheDocument()
    })
  })
})

const renderSearchFilter = () =>
  render(reactQueryProviderHOC(<SearchFilter />), {
    theme: { isDesktopViewport: true, isMobileViewport: false },
  })

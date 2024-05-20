import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { ISearchContext } from 'features/search/context/SearchWrapper'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import { SearchResults } from 'features/search/pages/SearchResults/SearchResults'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { useNetInfoContext as useNetInfoContextDefault } from 'libs/network/NetInfoWrapper'
import { PLACEHOLDER_DATA } from 'libs/subcategories/placeholderData'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('features/auth/context/AuthContext')

const mockStateDispatch = jest.fn()
const initialMockUseSearchResults = { searchState: initialSearchState, dispatch: mockStateDispatch }
const mockUseSearch: jest.Mock<Partial<ISearchContext>> = jest.fn(() => initialMockUseSearchResults)
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

jest.mock('libs/network/useNetInfo', () => jest.requireMock('@react-native-community/netinfo'))
const mockUseNetInfoContext = useNetInfoContextDefault as jest.Mock

const mockSettings = jest.fn().mockReturnValue({ data: {} })
jest.mock('features/auth/context/SettingsContext', () => ({
  useSettingsContext: jest.fn(() => mockSettings()),
}))

jest.mock('react-instantsearch-core', () => ({
  ...jest.requireActual('react-instantsearch-core'),
  useSearchBox: () => ({
    query: '',
    refine: jest.fn,
  }),
  useInfiniteHits: () => ({
    hits: [
      {
        objectID: '1',
        offer: { name: 'Test1', searchGroupName: 'MUSIQUE' },
        _geoloc: {},
      },
      {
        objectID: '2',
        offer: { name: 'Test2', searchGroupName: 'MUSIQUE' },
        _geoloc: {},
      },
    ],
  }),
}))

jest.spyOn(useFilterCountAPI, 'useFilterCount').mockReturnValue(3)
jest.mock('algoliasearch')

jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(),
}))

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(true)

describe('<SearchResults/>', () => {
  describe('Accessibility', () => {
    beforeEach(() => {
      mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', PLACEHOLDER_DATA)
    })

    it('should not have basic accessibility issues', async () => {
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: true })
      const { container } = render(reactQueryProviderHOC(<SearchResults />))

      await act(async () => {})

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })

    it('should not have basic accessibility issues when offline', async () => {
      mockUseNetInfoContext.mockReturnValueOnce({ isConnected: false })
      const { container } = render(reactQueryProviderHOC(<SearchResults />))

      await act(async () => {})

      await act(async () => {
        const results = await checkAccessibilityFor(container)

        expect(results).toHaveNoViolations()
      })
    })
  })
})

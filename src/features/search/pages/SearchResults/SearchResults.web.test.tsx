import React from 'react'

import { SubcategoriesResponseModelv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { ISearchContext } from 'features/search/context/SearchWrapper'
import * as useFilterCountAPI from 'features/search/helpers/useFilterCount/useFilterCount'
import { SearchResults } from 'features/search/pages/SearchResults/SearchResults'
import { useCenterOnLocation } from 'features/venueMap/hook/useCenterOnLocation'
import { useGetAllVenues } from 'features/venueMap/useGetAllVenues'
import { venuesFixture } from 'libs/algolia/fetchAlgolia/fetchVenues/fixtures/venuesFixture'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import * as useNetInfoContextDefault from 'libs/network/NetInfoWrapper'
import { subcategoriesDataTest } from 'libs/subcategories/fixtures/subcategoriesResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, checkAccessibilityFor, render } from 'tests/utils/web'

jest.mock('libs/firebase/firestore/exchangeRates/useGetPacificFrancToEuroRate')
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

jest.mock('libs/network/NetInfoWrapper')

jest.mock('features/auth/context/AuthContext')

const mockStateDispatch = jest.fn()
const initialMockUseSearchResults = { searchState: initialSearchState, dispatch: mockStateDispatch }
const mockUseSearch: jest.Mock<Partial<ISearchContext>> = jest.fn(() => initialMockUseSearchResults)
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => mockUseSearch(),
}))

const mockUseNetInfoContext = jest.spyOn(useNetInfoContextDefault, 'useNetInfoContext') as jest.Mock

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

jest.mock('libs/subcategories/useSubcategory')

jest.mock('uuid', () => ({
  v1: jest.fn(),
  v4: jest.fn(),
}))

jest.mock('libs/firebase/analytics/analytics')
jest.mock('libs/firebase/remoteConfig/remoteConfig.services')

const mockSetInitialVenues = jest.fn()
jest.mock('features/venueMap/store/initialVenuesStore', () => ({
  useInitialVenuesActions: () => ({ setInitialVenues: mockSetInitialVenues }),
  useInitialVenues: jest.fn(),
}))

jest.mock('features/venueMap/useGetAllVenues')
const mockUseGetAllVenues = useGetAllVenues as jest.Mock

jest.mock('features/venueMap/hook/useCenterOnLocation')
const mockUseCenterOnLocation = useCenterOnLocation as jest.Mock

jest.mock('features/venue/api/useVenueOffers')
jest.mock('features/venueMap/helpers/zoomOutIfMapEmpty')
jest.mock('features/navigation/TabBar/routes')

describe('<SearchResults/>', () => {
  describe('Accessibility', () => {
    beforeEach(() => {
      activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
      mockServer.getApi<SubcategoriesResponseModelv2>('/v1/subcategories/v2', subcategoriesDataTest)
    })

    beforeAll(() => {
      mockUseGetAllVenues.mockReturnValue({ venues: venuesFixture })
      mockUseCenterOnLocation.mockReturnValue(jest.fn())
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

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}

import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/__tests__/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { LocationMode } from 'libs/location/types'
import { renderHook } from 'tests/utils'

import { useShowResultsForCategory } from './useShowResultsForCategory'

let mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

jest.mock('libs/subcategories/useSubcategories')

const searchId = uuidv4()

jest.mock('libs/firebase/analytics/analytics')
jest.mock('features/navigation/TabBar/routes')

const navigationParams = {
  params: {
    params: {
      ...initialSearchState,
      offerCategories: [SearchGroupNameEnumv2.SPECTACLES],
      priceRange: [0, 300],
      query: 'Big flo et Oli',
      searchId,
      accessibilityFilter: {
        isAudioDisabilityCompliant: undefined,
        isMentalDisabilityCompliant: undefined,
        isMotorDisabilityCompliant: undefined,
        isVisualDisabilityCompliant: undefined,
      },
    },
    screen: 'SearchResults',
  },
  screen: 'SearchStackNavigator',
}

describe('useShowResultsForCategory', () => {
  describe('Category does not have ThematicSearch', () => {
    beforeEach(() => {
      setFeatureFlags()
      mockSearchState = {
        ...initialSearchState,
        locationFilter: { locationType: LocationMode.EVERYWHERE },
        priceRange: [0, 300],
        query: 'Big flo et Oli',
        offerCategories: [SearchGroupNameEnumv2.SPECTACLES], // initialize mock data with expected categories because dispatch is also a mock and won't change the mocked state
      }
    })

    it('should navigate to search results with search param when a category is selected', async () => {
      const { result: resultCallback } = renderHook(useShowResultsForCategory)

      resultCallback.current(SearchGroupNameEnumv2.SPECTACLES)

      expect(navigate).toHaveBeenCalledWith('TabNavigator', navigationParams)
    })

    it('should navigate to search results with isFullyDigitalOffersCategory param when category selected is only online platform', async () => {
      const { result: resultCallback } = renderHook(useShowResultsForCategory)

      resultCallback.current(SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE)

      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        ...navigationParams,
        params: {
          ...navigationParams.params,
          params: {
            ...navigationParams.params.params,
            isFullyDigitalOffersCategory: true,
            offerCategories: [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE],
          },
        },
      })
    })

    it('should navigate to search results without isFromHistory param when category selected and previous search was from history', async () => {
      const { result: resultCallback } = renderHook(useShowResultsForCategory)

      resultCallback.current(SearchGroupNameEnumv2.SPECTACLES)

      expect(navigate).toHaveBeenCalledWith('TabNavigator', navigationParams)
    })
  })

  describe('Category has a ThematicSearch', () => {
    beforeEach(() => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_PAGE_SEARCH_N1])
      mockSearchState = {
        ...initialSearchState,
        locationFilter: { locationType: LocationMode.EVERYWHERE },
        priceRange: [0, 300],
        query: 'Big flo et Oli',
        offerCategories: [SearchGroupNameEnumv2.LIVRES],
        isFromHistory: undefined,
        isFullyDigitalOffersCategory: undefined,
        offerGenreTypes: undefined,
        offerNativeCategories: undefined,
        searchId: 'testUuidV4',
      }
    })

    it('should navigate to ThematicSearch (livres)', () => {
      const { result: resultCallback } = renderHook(useShowResultsForCategory)

      resultCallback.current(SearchGroupNameEnumv2.LIVRES)

      expect(navigate).toHaveBeenCalledWith('TabNavigator', {
        ...navigationParams,
        params: {
          ...navigationParams.params,
          params: {
            ...navigationParams.params.params,
            offerCategories: [SearchGroupNameEnumv2.LIVRES],
          },
          screen: 'ThematicSearch',
        },
      })
    })
  })
})

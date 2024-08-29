import { v4 as uuidv4 } from 'uuid'

import { navigate } from '__mocks__/@react-navigation/native'
import { SearchGroupNameEnumv2 } from 'api/gen'
import { initialSearchState } from 'features/search/context/reducer'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
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
jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('useShowResultsForCategory', () => {
  beforeEach(() => {
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

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: {
        params: {
          beginningDatetime: undefined,
          date: null,
          endingDatetime: undefined,
          hitsPerPage: 20,
          locationFilter: { locationType: 'EVERYWHERE' },
          offerCategories: [SearchGroupNameEnumv2.SPECTACLES],
          offerIsDuo: false,
          offerIsFree: false,
          offerSubcategories: [],
          isDigital: false,
          priceRange: [0, 300],
          query: 'Big flo et Oli',
          tags: [],
          timeRange: null,
          searchId,
          gtls: [],
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
    })
  })

  it('should navigate to search results with isFullyDigitalOffersCategory param when category selected is only online platform', async () => {
    const { result: resultCallback } = renderHook(useShowResultsForCategory)

    resultCallback.current(SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: {
        params: {
          ...initialSearchState,
          beginningDatetime: undefined,
          date: null,
          endingDatetime: undefined,
          hitsPerPage: 20,
          isFullyDigitalOffersCategory: true,
          locationFilter: { locationType: 'EVERYWHERE' },
          offerCategories: [SearchGroupNameEnumv2.EVENEMENTS_EN_LIGNE],
          offerIsDuo: false,
          offerIsFree: false,
          offerSubcategories: [],
          isDigital: false,
          priceRange: [0, 300],
          query: 'Big flo et Oli',
          tags: [],
          timeRange: null,
          searchId,
          gtls: [],
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
    })
  })

  it('should navigate to search results without isFromHistory param when category selected and previous search was from history', async () => {
    const { result: resultCallback } = renderHook(useShowResultsForCategory)

    resultCallback.current(SearchGroupNameEnumv2.SPECTACLES)

    expect(navigate).toHaveBeenCalledWith('TabNavigator', {
      params: {
        params: {
          beginningDatetime: undefined,
          date: null,
          endingDatetime: undefined,
          hitsPerPage: 20,
          locationFilter: { locationType: 'EVERYWHERE' },
          offerCategories: [SearchGroupNameEnumv2.SPECTACLES],
          offerIsDuo: false,
          offerIsFree: false,
          offerSubcategories: [],
          isDigital: false,
          priceRange: [0, 300],
          query: 'Big flo et Oli',
          tags: [],
          timeRange: null,
          searchId,
          gtls: [],
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
    })
  })
})

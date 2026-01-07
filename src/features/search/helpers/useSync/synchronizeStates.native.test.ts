import { initialSearchState } from 'features/search/context/reducer'
import {
  hasUrlParams,
  syncLocationFromParams,
} from 'features/search/helpers/useSync/synchronizeStates'
import { LocationMode } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'

const mockSearchState = initialSearchState

describe('hasUrlParams', () => {
  it('should be false when no pending params', () => {
    expect(hasUrlParams({}, mockSearchState)).toBe(false)
  })

  it('should be true when every key has null/undefined urlvalue or empty array', () => {
    expect(
      hasUrlParams(
        {
          lock: null,
          stock: undefined,
          two_smoking_barrels: [],
        },
        mockSearchState
      )
    ).toBe(true)
  })

  it('should be true when keys from pendingParams are equal to searchState keys', () => {
    expect(
      hasUrlParams(
        {
          lock: null,
          stock: undefined,
          two_smoking_barrels: [],
          priceRange: [10, 20],
          defaultMaxPrice: '30',
        },
        { ...mockSearchState, priceRange: [10, 20], defaultMaxPrice: '30' }
      )
    ).toBe(true)
  })

  it('should be false when keys from pendingParams are not all equal to searchState keys', () => {
    expect(
      hasUrlParams(
        {
          priceRange: [10, 20],
          defaultMaxPrice: '40',
        },
        { ...mockSearchState, priceRange: [10, 20], defaultMaxPrice: '30' }
      )
    ).toBe(false)
  })
})

const mockedHandlers = {
  setPlace: jest.fn(),
  setSelectedPlace: jest.fn(),
  setSelectedLocationMode: jest.fn(),
  setCanSwitchToAroundMe: jest.fn(),
}

describe('syncLocationFromParams', () => {
  it('should call setSelectedLocationMode when LocationMode is EVERYWHERE', () => {
    syncLocationFromParams({ locationType: LocationMode.EVERYWHERE }, mockedHandlers)

    expect(mockedHandlers.setSelectedLocationMode).toHaveBeenCalledWith(LocationMode.EVERYWHERE)
  })

  it('should call setCanSwitchToAroundMe when LocationMode is AROUND_ME', () => {
    syncLocationFromParams(
      { locationType: LocationMode.AROUND_ME, aroundRadius: 5000 },
      mockedHandlers
    )

    expect(mockedHandlers.setCanSwitchToAroundMe).toHaveBeenCalledWith(true)
  })

  it('should call handlers when LocationMode is AROUND_PLACE', () => {
    const mockedPlace = {
      label: 'label',
      info: 'info',
      type: 'locality',
      geolocation: {
        longitude: 10,
        latitude: 8,
      },
    } as SuggestedPlace

    syncLocationFromParams(
      {
        locationType: LocationMode.AROUND_PLACE,
        aroundRadius: 5000,
        place: mockedPlace,
      },
      mockedHandlers
    )

    expect(mockedHandlers.setPlace).toHaveBeenCalledWith(mockedPlace)
    expect(mockedHandlers.setSelectedPlace).toHaveBeenCalledWith(mockedPlace)
    expect(mockedHandlers.setSelectedLocationMode).toHaveBeenCalledWith(LocationMode.AROUND_PLACE)
  })
})

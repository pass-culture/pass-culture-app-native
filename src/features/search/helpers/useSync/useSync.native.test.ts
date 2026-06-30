import { useRoute } from '__mocks__/@react-navigation/native'
import { initialSearchState } from 'features/search/context/reducer'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { GeolocPermissionState } from 'libs/location/location'
import { LocationMode, Position } from 'libs/location/types'
import { SuggestedPlace } from 'libs/place/types'
import { act, renderHook } from 'tests/utils'

import { useSync } from './useSync'

const mockSearchState = initialSearchState
const mockDispatch = jest.fn()
jest.mock('features/search/context/SearchWrapper', () => ({
  useSearch: () => ({
    searchState: mockSearchState,
    dispatch: mockDispatch,
  }),
}))

jest.mock('queries/subcategories/useSubcategoriesQuery')

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

const mockedPlace: SuggestedPlace = {
  label: 'Kourou',
  info: 'Guyane',
  type: 'street',
  geolocation: { longitude: -52.669736, latitude: 5.16186 },
}

const mockShowGeolocPermissionModal = jest.fn()
const mockSelectedLocationMode = jest.fn()
const mockedPosition = { latitude: 2, longitude: 40 } as Position
const mockedNoPosition = null as Position
const everywhereUseLocation = {
  geolocPosition: mockedNoPosition,
  geolocPositionError: null,
  place: mockedPlace,
  userLocation: mockedNoPosition,
  selectedLocationMode: LocationMode.EVERYWHERE,
  hasGeolocPosition: false,
  permissionState: GeolocPermissionState.DENIED,
  onModalHideRef: jest.fn(),
  setPlace: jest.fn(),
  isCurrentLocationMode: jest.fn(),
  setSelectedLocationMode: mockSelectedLocationMode,
  showGeolocPermissionModal: mockShowGeolocPermissionModal,
  triggerPositionUpdate: jest.fn(),
  onPressGeolocPermissionModalButton: jest.fn(),
  onResetPlace: jest.fn(),
  selectedPlace: null,
  setSelectedPlace: jest.fn(),
  placeQuery: '',
  setPlaceQuery: jest.fn(),
}

const mockUseLocation = jest.fn(() => everywhereUseLocation)
jest.mock('libs/location/useLocation', () => ({
  useLocation: () => mockUseLocation(),
}))
mockUseLocation.mockReturnValue(everywhereUseLocation)

describe('useSync', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_VENUE_MAP])
  })

  it('should update search state with locationType params when user has geolocPosition', async () => {
    mockUseLocation
      .mockReturnValueOnce({
        ...everywhereUseLocation,
        hasGeolocPosition: true,
        geolocPosition: mockedPosition,
      })
      .mockReturnValueOnce({
        ...everywhereUseLocation,
        hasGeolocPosition: true,
        geolocPosition: mockedPosition,
      })
      .mockReturnValueOnce({
        ...everywhereUseLocation,
        hasGeolocPosition: true,
        geolocPosition: mockedPosition,
      })

    useRoute
      .mockReturnValueOnce({
        params: {
          locationFilter: {
            locationType: LocationMode.AROUND_ME,
            aroundRadius: 'all',
          },
        },
      })
      .mockReturnValueOnce({
        params: {
          locationFilter: {
            locationType: LocationMode.AROUND_ME,
            aroundRadius: 'all',
          },
        },
      })
      .mockReturnValueOnce({
        params: {
          locationFilter: {
            locationType: LocationMode.AROUND_ME,
            aroundRadius: 'all',
          },
        },
      })
    renderHook(() => {
      useSync()
    })
    await act(async () => {})
    await act(async () => {})
    await act(async () => {})

    expect(mockSelectedLocationMode).toHaveBeenCalledWith(LocationMode.AROUND_ME)
  })

  it('should not update search state with locationType params when user has no geolocPosition', async () => {
    mockUseLocation
      .mockReturnValueOnce(everywhereUseLocation)
      .mockReturnValueOnce(everywhereUseLocation)
      .mockReturnValueOnce(everywhereUseLocation)

    useRoute
      .mockReturnValueOnce({
        params: {
          locationFilter: {
            locationType: LocationMode.AROUND_ME,
            aroundRadius: 'all',
          },
        },
      })
      .mockReturnValueOnce({
        params: {
          locationFilter: {
            locationType: LocationMode.AROUND_ME,
            aroundRadius: 'all',
          },
        },
      })
      .mockReturnValueOnce({
        params: {
          locationFilter: {
            locationType: LocationMode.AROUND_ME,
            aroundRadius: 'all',
          },
        },
      })
    renderHook(() => {
      useSync()
    })
    await act(async () => {})
    await act(async () => {})
    await act(async () => {})

    expect(mockSelectedLocationMode).not.toHaveBeenCalled()
  })
})

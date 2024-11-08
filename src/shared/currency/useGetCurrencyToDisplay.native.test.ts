import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location'
import { ILocationContext, LocationMode } from 'libs/location/types'
import { renderHook } from 'tests/utils'

import { useGetCurrencyToDisplay } from './useGetCurrencyToDisplay'

jest.mock('libs/firebase/remoteConfig/remoteConfig.services')
const useFeatureFlagSpy = jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag')

jest.mock('libs/location')
const mockUseGeolocation = jest.mocked(useLocation)
const NOUMEA_DEFAULT_POSITION = { longitude: 166.445742, latitude: -22.26308 }
const PARIS_DEFAULT_POSITION = { latitude: 48.859, longitude: 2.347 }

describe('useGetCurrencyToDisplay', () => {
  beforeEach(() => {
    activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it('should return Euro when no location is provided', () => {
    mockUseGeolocation.mockReturnValueOnce({ userLocation: null } as ILocationContext)

    const { result } = renderHook(() => useGetCurrencyToDisplay())

    expect(result.current).toBe('€')
  })

  it('should return Pacific Franc when location is New Caledonia and feature flag is enabled', () => {
    mockUseGeolocation.mockReturnValueOnce({
      userLocation: NOUMEA_DEFAULT_POSITION,
      selectedLocationMode: LocationMode.AROUND_PLACE,
      selectedPlace: {
        type: 'municipality',
        label: 'Nouméa',
        info: 'Nouvelle-Calédonie',
        geolocation: NOUMEA_DEFAULT_POSITION,
      },
    } as ILocationContext)

    const { result } = renderHook(() => useGetCurrencyToDisplay())

    expect(result.current).toBe('F')
  })

  it('should return Euro when location is not New Caledonia', () => {
    mockUseGeolocation.mockReturnValueOnce({
      userLocation: PARIS_DEFAULT_POSITION,
      selectedLocationMode: LocationMode.AROUND_PLACE,
      selectedPlace: {
        type: 'municipality',
        label: 'Paris',
        info: 'Paris',
        geolocation: PARIS_DEFAULT_POSITION,
      },
    } as ILocationContext)

    const { result } = renderHook(() => useGetCurrencyToDisplay())

    expect(result.current).toBe('€')
  })

  it('should return Euro when location is New Caledonia but feature flag is disabled', () => {
    activateFeatureFlags()
    mockUseGeolocation.mockReturnValueOnce({
      userLocation: NOUMEA_DEFAULT_POSITION,
      selectedLocationMode: LocationMode.AROUND_PLACE,
      selectedPlace: {
        type: 'municipality',
        label: 'Nouméa',
        info: 'Nouvelle-Calédonie',
        geolocation: NOUMEA_DEFAULT_POSITION,
      },
    } as ILocationContext)

    const { result } = renderHook(() => useGetCurrencyToDisplay())

    expect(result.current).toBe('€')
  })
})

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}

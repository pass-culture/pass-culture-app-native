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
    activateFeatureFlags()
  })

  it('should return Euro by default when location is not provided', () => {
    mockUseGeolocation.mockReturnValueOnce({ userLocation: null } as ILocationContext)
    const { result } = renderHook(() => useGetCurrencyToDisplay())

    expect(result.current).toBe('€')
  })

  describe('when location is outside New Caledonia', () => {
    beforeEach(() => {
      mockUseGeolocation.mockReturnValue({
        userLocation: PARIS_DEFAULT_POSITION,
        selectedLocationMode: LocationMode.AROUND_PLACE,
        selectedPlace: {
          type: 'municipality',
          label: 'Paris',
          info: 'Paris',
          geolocation: PARIS_DEFAULT_POSITION,
        },
      } as ILocationContext)
    })

    it('should return Euro when displayFormat is "short"', () => {
      const { result } = renderHook(() => useGetCurrencyToDisplay('short'))

      expect(result.current).toBe('€')
    })

    it('should return Euro when displayFormat is "full"', () => {
      const { result } = renderHook(() => useGetCurrencyToDisplay('full'))

      expect(result.current).toBe('€')
    })
  })

  describe('when location is in New Caledonia', () => {
    beforeEach(() => {
      mockUseGeolocation.mockReturnValue({
        userLocation: NOUMEA_DEFAULT_POSITION,
        selectedLocationMode: LocationMode.AROUND_PLACE,
        selectedPlace: {
          type: 'municipality',
          label: 'Nouméa',
          info: 'Nouvelle-Calédonie',
          geolocation: NOUMEA_DEFAULT_POSITION,
        },
      } as ILocationContext)
    })

    describe('and the feature flag is enabled', () => {
      beforeEach(() => {
        activateFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
      })

      it('should return Pacific Franc short ("F") when displayFormat is "short"', () => {
        const { result } = renderHook(() => useGetCurrencyToDisplay('short'))

        expect(result.current).toBe('F')
      })

      it('should return Pacific Franc full ("Franc Pacifique") when displayFormat is "full"', () => {
        const { result } = renderHook(() => useGetCurrencyToDisplay('full'))

        expect(result.current).toBe('Franc\u00a0Pacifique')
      })
    })

    describe('and the feature flag is disabled', () => {
      beforeEach(() => {
        activateFeatureFlags([])
      })

      it('should return Euro when displayFormat is "short"', () => {
        const { result } = renderHook(() => useGetCurrencyToDisplay('short'))

        expect(result.current).toBe('€')
      })

      it('should return Euro when displayFormat is "full"', () => {
        const { result } = renderHook(() => useGetCurrencyToDisplay('full'))

        expect(result.current).toBe('€')
      })
    })
  })
})

const activateFeatureFlags = (activeFeatureFlags: RemoteStoreFeatureFlags[] = []) => {
  useFeatureFlagSpy.mockImplementation((flag) => activeFeatureFlags.includes(flag))
}

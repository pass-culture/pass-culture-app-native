import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native'

import { CurrencyEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { useLocation } from 'libs/location/location'
import { ILocationContext, LocationMode } from 'libs/location/types'
import { renderHook } from 'tests/utils'

import { useGetCurrencyToDisplay } from './useGetCurrencyToDisplay'

jest.mock('libs/location/location')
const mockUseGeolocation = jest.mocked(useLocation)
const NOUMEA_DEFAULT_POSITION = { longitude: 166.445742, latitude: -22.26308 }
const PARIS_DEFAULT_POSITION = { latitude: 48.859, longitude: 2.347 }

jest.mock('@react-navigation/native')
const mockUseRoute = jest.mocked(useRoute)
const createRoute = (params): RouteProp<ParamListBase> => ({
  key: 'test-key',
  name: 'TestScreen',
  params,
})

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = jest.mocked(useAuthContext)

describe('useGetCurrencyToDisplay', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockUseGeolocation.mockReturnValue({ userLocation: null } as ILocationContext)
    mockUseAuthContext.mockReturnValue({
      isLoggedIn: true,
      user: undefined,
      setIsLoggedIn: jest.fn(),
      refetchUser: jest.fn(),
      isUserLoading: false,
    })
  })

  it('should return Euro by default when location and user are not provided', () => {
    const { result } = renderHook(() => useGetCurrencyToDisplay())

    expect(result.current).toBe('€')
  })

  describe('when currency params is provided', () => {
    it('should return Euro if currency param is EUR', () => {
      mockUseRoute.mockReturnValueOnce(createRoute({ currency: CurrencyEnum.EUR }))

      const { result } = renderHook(() => useGetCurrencyToDisplay('short'))

      expect(result.current).toBe('€')
    })

    it('should return Pacific Franc short if currency param is XPF', () => {
      mockUseRoute.mockReturnValueOnce(createRoute({ currency: CurrencyEnum.XPF }))

      const { result } = renderHook(() => useGetCurrencyToDisplay('short'))

      expect(result.current).toBe('F')
    })

    it('should return Euro if currency param is missing', () => {
      mockUseRoute.mockReturnValueOnce(createRoute({}))

      const { result } = renderHook(() => useGetCurrencyToDisplay('short'))

      expect(result.current).toBe('€')
    })

    it('should return Euro if params is undefined', () => {
      mockUseRoute.mockReturnValueOnce(createRoute(undefined))

      const { result } = renderHook(() => useGetCurrencyToDisplay('short'))

      expect(result.current).toBe('€')
    })
  })

  describe('when location mode is EVERYWHERE', () => {
    beforeEach(() => {
      mockUseGeolocation.mockReturnValue({
        userLocation: null,
        selectedLocationMode: LocationMode.EVERYWHERE,
        selectedPlace: null,
      } as ILocationContext)
    })

    describe('and the feature flag is enabled', () => {
      beforeEach(() => {
        setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
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

    describe('and the feature flag is disabled', () => {
      beforeEach(() => {
        setFeatureFlags()
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

  describe('when selectedPlace is defined in New Caledonia and location mode is EVERYWHERE', () => {
    beforeEach(() => {
      mockUseGeolocation.mockReturnValue({
        userLocation: null,
        selectedLocationMode: LocationMode.EVERYWHERE,
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
        setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
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

    describe('and the feature flag is disabled', () => {
      beforeEach(() => {
        setFeatureFlags()
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

  describe('when user is not connected and location is outside New Caledonia', () => {
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

  describe('when user is not connected and location is in New Caledonia', () => {
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
        setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
      })

      it('should return Pacific Franc short ("F") when displayFormat is "short"', () => {
        const { result } = renderHook(() => useGetCurrencyToDisplay('short'))

        expect(result.current).toBe('F')
      })

      it('should return Pacific Franc full ("francs Pacifique") when displayFormat is "full"', () => {
        const { result } = renderHook(() => useGetCurrencyToDisplay('full'))

        expect(result.current).toBe('francs\u00a0Pacifique')
      })
    })

    describe('and the feature flag is disabled', () => {
      beforeEach(() => {
        setFeatureFlags()
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

  describe('when user is registered in Euro region', () => {
    beforeEach(() => {
      mockUseAuthContext.mockReturnValue({
        isLoggedIn: true,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
        isUserLoading: false,
        user: { ...beneficiaryUser, currency: CurrencyEnum.EUR },
      })
    })

    describe('and the feature flag is enabled', () => {
      beforeEach(() => {
        setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
      })

      it('should return Euro when displayFormat is "short"', async () => {
        const { result } = renderHook(() => useGetCurrencyToDisplay('short'))

        expect(result.current).toBe('€')
      })

      it('should return Euro when displayFormat is "full"', () => {
        const { result } = renderHook(() => useGetCurrencyToDisplay('full'))

        expect(result.current).toBe('€')
      })
    })

    describe('and the feature flag is disabled', () => {
      beforeEach(() => setFeatureFlags())

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

  describe('when user is registered in Pacific Franc region', () => {
    beforeEach(() => {
      mockUseAuthContext.mockReturnValue({
        isLoggedIn: true,
        setIsLoggedIn: jest.fn(),
        refetchUser: jest.fn(),
        isUserLoading: false,
        user: { ...beneficiaryUser, currency: CurrencyEnum.XPF },
      })
    })

    describe('and the feature flag is enabled', () => {
      beforeEach(() => {
        setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
      })

      it('should return Pacific Franc short ("F") when displayFormat is "short"', () => {
        const { result } = renderHook(() => useGetCurrencyToDisplay('short'))

        expect(result.current).toBe('F')
      })

      it('should return Pacific Franc full ("francs Pacifique") when displayFormat is "full"', () => {
        const { result } = renderHook(() => useGetCurrencyToDisplay('full'))

        expect(result.current).toBe('francs\u00a0Pacifique')
      })
    })

    describe('and the feature flag is disabled', () => {
      beforeEach(() => setFeatureFlags())

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

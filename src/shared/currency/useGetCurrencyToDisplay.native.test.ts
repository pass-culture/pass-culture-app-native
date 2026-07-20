import { CurrencyEnum } from 'api/gen'
import { useAuthContext } from 'features/auth/context/AuthContext'
import { beneficiaryUser } from 'fixtures/user'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { LocationMode } from 'libs/location/types'
import {
  defaultLocationState,
  locationActions,
  useLocationV2,
} from 'libs/locationV2/location.store'
import { renderHook } from 'tests/utils'

import { useGetCurrencyToDisplay } from './useGetCurrencyToDisplay'

const NOUMEA_DEFAULT_POSITION = { longitude: 166.445742, latitude: -22.26308 }
const PARIS_DEFAULT_POSITION = { latitude: 48.859, longitude: 2.347 }

jest.mock('features/auth/context/AuthContext')
const mockUseAuthContext = jest.mocked(useAuthContext)

describe('useGetCurrencyToDisplay', () => {
  beforeEach(() => {
    setFeatureFlags()
    useLocationV2.setState(defaultLocationState)
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

  describe('when location mode is EVERYWHERE', () => {
    beforeEach(() => {
      locationActions.setLocationMode(LocationMode.EVERYWHERE)
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

  describe('when selectedPlace is defined in New Caledonia and location mode is EVERYWHERE', () => {
    beforeEach(() => {
      locationActions.setPlace({
        type: 'municipality',
        label: 'Nouméa',
        info: 'Nouvelle-Calédonie',
        geolocation: NOUMEA_DEFAULT_POSITION,
      })
      locationActions.setLocationMode(LocationMode.EVERYWHERE)
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

  describe('when user is not connected and location is outside New Caledonia', () => {
    beforeEach(() => {
      locationActions.setPlace({
        type: 'municipality',
        label: 'Paris',
        info: 'Paris',
        geolocation: PARIS_DEFAULT_POSITION,
      })
      locationActions.setLocationMode(LocationMode.AROUND_PLACE)
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
      locationActions.setPlace({
        type: 'municipality',
        label: 'Nouméa',
        info: 'Nouvelle-Calédonie',
        geolocation: NOUMEA_DEFAULT_POSITION,
      })
      locationActions.setLocationMode(LocationMode.AROUND_PLACE)
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

    it('should return Euro when displayFormat is "short"', async () => {
      const { result } = renderHook(() => useGetCurrencyToDisplay('short'))

      expect(result.current).toBe('€')
    })

    it('should return Euro when displayFormat is "full"', () => {
      const { result } = renderHook(() => useGetCurrencyToDisplay('full'))

      expect(result.current).toBe('€')
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

    it('should return Pacific Franc short ("F") when displayFormat is "short"', () => {
      const { result } = renderHook(() => useGetCurrencyToDisplay('short'))

      expect(result.current).toBe('F')
    })

    it('should return Pacific Franc full ("francs Pacifique") when displayFormat is "full"', () => {
      const { result } = renderHook(() => useGetCurrencyToDisplay('full'))

      expect(result.current).toBe('francs\u00a0Pacifique')
    })
  })
})

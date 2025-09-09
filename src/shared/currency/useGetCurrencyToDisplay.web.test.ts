import { CurrencyEnum } from 'api/gen'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { useLocation } from 'libs/location/location'
import { ILocationContext } from 'libs/location/types'
import { getCurrencyFromParam } from 'shared/currency/useCurrencyParam'
import { renderHook } from 'tests/utils/web'

import { useGetCurrencyToDisplay } from './useGetCurrencyToDisplay'

jest.mock('shared/currency/useCurrencyParam')
const mockGetCurrencyFromParam = jest.mocked(getCurrencyFromParam)

jest.mock('libs/location/location')
const mockUseGeolocation = jest.mocked(useLocation)

jest.mock('features/auth/context/AuthContext')

describe('useGetCurrencyToDisplay', () => {
  beforeEach(() => {
    setFeatureFlags()
    mockUseGeolocation.mockReturnValue({ userLocation: null } as ILocationContext)
  })

  describe('when currency params is provided', () => {
    it('should return Euro if currency param is EUR', () => {
      mockGetCurrencyFromParam.mockReturnValueOnce(CurrencyEnum.EUR)

      const { result } = renderHook(() => useGetCurrencyToDisplay('short'))

      expect(result.current).toBe('€')
    })

    it('should return Pacific Franc short if currency param is XPF', () => {
      mockGetCurrencyFromParam.mockReturnValueOnce(CurrencyEnum.XPF)

      const { result } = renderHook(() => useGetCurrencyToDisplay('short'))

      expect(result.current).toBe('F')
    })
  })
})

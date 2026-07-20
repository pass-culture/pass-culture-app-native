import { CurrencyEnum } from 'api/gen'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { defaultLocationState, useLocationV2 } from 'libs/locationV2/location.store'
import { getCurrencyFromParam } from 'shared/currency/getCurrencyParam'
import { renderHook } from 'tests/utils/web'

import { useGetCurrencyToDisplay } from './useGetCurrencyToDisplay'

jest.mock('shared/currency/getCurrencyParam')
const mockGetCurrencyFromParam = jest.mocked(getCurrencyFromParam)

jest.mock('features/auth/context/AuthContext')

describe('useGetCurrencyToDisplay', () => {
  beforeEach(() => {
    setFeatureFlags()
    useLocationV2.setState(defaultLocationState)
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

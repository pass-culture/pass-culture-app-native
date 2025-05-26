import mockdate from 'mockdate'

import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { renderHook } from 'tests/utils'

import { useGetDepositAmountsByAge } from './useGetDepositAmountsByAge'

const TODAY = '2022-10-24'
mockdate.set(new Date(TODAY))

describe('useGetDepositAmountsByAge', () => {
  beforeEach(() => {
    setFeatureFlags([RemoteStoreFeatureFlags.ENABLE_PACIFIC_FRANC_CURRENCY])
  })

  it('should return nothing when birthDate is not defined', () => {
    const { result } = renderHook(() => useGetDepositAmountsByAge())

    expect(result.current).toBeUndefined()
  })

  it('should return nothing when age is less than 15 years old', () => {
    const FOURTEEN_YEARS_OLD_DATE = '2008-10-24'
    const { result } = renderHook(() => useGetDepositAmountsByAge(FOURTEEN_YEARS_OLD_DATE))

    expect(result.current).toBeUndefined()
  })

  it('should return "0€" when 15 years old', () => {
    const FIFTEEN_YEARS_OLD_DATE = '2007-10-24'
    const { result } = renderHook(() => useGetDepositAmountsByAge(FIFTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual('0\u00a0€')
  })

  it('should return "0€" when 16 years old', () => {
    const SIXTEEN_YEARS_OLD_DATE = '2006-10-24'
    const { result } = renderHook(() => useGetDepositAmountsByAge(SIXTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual('0\u00a0€')
  })

  it('should return "50€" when 17 years old', () => {
    const SEVENTEEN_YEARS_OLD_DATE = '2005-10-24'
    const { result } = renderHook(() => useGetDepositAmountsByAge(SEVENTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual('50\u00a0€')
  })

  it('should return "150€" when 18 years old', () => {
    const EIGHTEEN_YEARS_OLD_DATE = '2004-10-24'
    const { result } = renderHook(() => useGetDepositAmountsByAge(EIGHTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual('150\u00a0€')
  })

  it('should return nothing when age is more than 18 years old', () => {
    const NINETEEN_YEARS_OLD_DATE = '2003-10-24'
    const { result } = renderHook(() => useGetDepositAmountsByAge(NINETEEN_YEARS_OLD_DATE))

    expect(result.current).toBeUndefined()
  })
})

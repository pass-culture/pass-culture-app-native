import mockdate from 'mockdate'

import { useGetDepositAmountsByAge } from 'features/offer/services/useGetDepositAmountsByAge'
import { renderHook } from 'tests/utils'

const TODAY = '2022-10-24'
mockdate.set(new Date(TODAY))

jest.mock('features/auth/api')

describe('useGetDepositAmountsByAge', () => {
  it('should return nothing when birthDate is not defined', () => {
    const { result } = renderHook(() => useGetDepositAmountsByAge())

    expect(result.current).toBeUndefined()
  })

  it('should return nothing when age is less than 15 years old', () => {
    const FOURTEEN_YEARS_OLD_DATE = '2008-10-24'
    const { result } = renderHook(() => useGetDepositAmountsByAge(FOURTEEN_YEARS_OLD_DATE))

    expect(result.current).toBeUndefined()
  })

  it('should return "20€" when 15 years old', () => {
    const FIFTEEN_YEARS_OLD_DATE = '2007-10-24'
    const { result } = renderHook(() => useGetDepositAmountsByAge(FIFTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual('20\u00a0€')
  })

  it('should return "30€" when 16 years old', () => {
    const SIXTEEN_YEARS_OLD_DATE = '2006-10-24'
    const { result } = renderHook(() => useGetDepositAmountsByAge(SIXTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual('30\u00a0€')
  })

  it('should return "30€" when 17 years old', () => {
    const SEVENTEEN_YEARS_OLD_DATE = '2005-10-24'
    const { result } = renderHook(() => useGetDepositAmountsByAge(SEVENTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual('30\u00a0€')
  })

  it('should return "300€" when 18 years old', () => {
    const EIGHTEEN_YEARS_OLD_DATE = '2004-10-24'
    const { result } = renderHook(() => useGetDepositAmountsByAge(EIGHTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual('300\u00a0€')
  })

  it('should return nothing when age is more than 18 years old', () => {
    const NINETEEN_YEARS_OLD_DATE = '2003-10-24'
    const { result } = renderHook(() => useGetDepositAmountsByAge(NINETEEN_YEARS_OLD_DATE))

    expect(result.current).toBeUndefined()
  })
})

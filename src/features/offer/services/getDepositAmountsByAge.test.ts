import mockdate from 'mockdate'

import { getDepositAmountsByAge } from 'features/offer/services/getDepositAmountsByAge'
import { renderHook } from 'tests/utils'

const TODAY = '2022-10-24'
mockdate.set(new Date(TODAY))

describe('getDepositAmountsByAge', () => {
  it('should return nothing when age is less than 15 years old', () => {
    const FOURTEEN_YEARS_OLD_DATE = '2008-10-24'
    const { result } = renderHook(() => getDepositAmountsByAge(FOURTEEN_YEARS_OLD_DATE))

    expect(result.current).toBeUndefined()
  })

  it('should return "20€" when 15 years old', () => {
    const FIFTEEN_YEARS_OLD_DATE = '2007-10-24'
    const { result } = renderHook(() => getDepositAmountsByAge(FIFTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual('20 €')
  })

  it('should return "20€" when 16 years old', () => {
    const SIXTEEN_YEARS_OLD_DATE = '2006-10-24'
    const { result } = renderHook(() => getDepositAmountsByAge(SIXTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual('20 €')
  })

  it('should return "30€" when 17 years old', () => {
    const SEVENTEEN_YEARS_OLD_DATE = '2005-10-24'
    const { result } = renderHook(() => getDepositAmountsByAge(SEVENTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual('30 €')
  })

  it('should return "300€" when 18 years old', () => {
    const EIGHTEEN_YEARS_OLD_DATE = '2004-10-24'
    const { result } = renderHook(() => getDepositAmountsByAge(EIGHTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual('300 €')
  })

  it('should return nothing when age is more than 18 years old', () => {
    const NINETEEN_YEARS_OLD_DATE = '2003-10-24'
    const { result } = renderHook(() => getDepositAmountsByAge(NINETEEN_YEARS_OLD_DATE))

    expect(result.current).toBeUndefined()
  })
})

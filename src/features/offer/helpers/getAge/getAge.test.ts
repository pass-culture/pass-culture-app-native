import mockdate from 'mockdate'

import { getAge } from 'features/offer/helpers/getAge/getAge'
import { renderHook } from 'tests/utils'

const TODAY = '2022-10-24'
mockdate.set(new Date(TODAY))

describe('getAge', () => {
  it('should render 14 when is the 15 years old year but not 15 years old yet', () => {
    const FOURTEEN_YEARS_OLD_DATE = '2007-11-24'
    const { result } = renderHook(() => getAge(FOURTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual(14)
  })

  it('should render 14 when the date is almost 15 years old', () => {
    const FIFTEEN_YEARS_OLD_DATE_MINUS_ONE_DAY = '2007-10-25'
    const { result } = renderHook(() => getAge(FIFTEEN_YEARS_OLD_DATE_MINUS_ONE_DAY))

    expect(result.current).toEqual(14)
  })

  it('should render 15 when 15 years old date', () => {
    const FIFTEEN_YEARS_OLD_DATE = '2007-10-24'
    const { result } = renderHook(() => getAge(FIFTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual(15)
  })

  it('should render 16 when 16 years old date', () => {
    const SIXTEEN_YEARS_OLD_DATE = '2006-10-24'
    const { result } = renderHook(() => getAge(SIXTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual(16)
  })

  it('should render 17 when 17 years old date', () => {
    const SEVENTEEN_YEARS_OLD_DATE = '2005-10-24'
    const { result } = renderHook(() => getAge(SEVENTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual(17)
  })

  it('should render 18 when 18 years old date', () => {
    const EIGHTEEN_YEARS_OLD_DATE = '2004-10-24'
    const { result } = renderHook(() => getAge(EIGHTEEN_YEARS_OLD_DATE))

    expect(result.current).toEqual(18)
  })
})

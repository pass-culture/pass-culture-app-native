import mockDate from 'mockdate'

import { CURRENT_DATE } from 'features/auth/signup/SetBirthday/utils/fixtures'
import { computeDateRangeDisplay } from 'features/home/components/modules/helpers/computeDateRangeDisplay'

mockDate.set(CURRENT_DATE)

describe('computeDateRangeDisplay', () => {
  it('should return formatted date range when dates are different', () => {
    const beginningDate = new Date('2020-12-01')
    const endingDate = new Date('2021-01-01')

    const dateRange = computeDateRangeDisplay(beginningDate, endingDate)

    expect(dateRange).toEqual('du 01/12 au 01/01')
  })

  it('should return formatted date range when dates are the same day', () => {
    const beginningDate = new Date('2020-12-03T20:00:00')
    const endingDate = new Date('2020-12-03T22:00:00')

    const dateRange = computeDateRangeDisplay(beginningDate, endingDate)

    expect(dateRange).toEqual('le 03/12')
  })

  it('should return null when date range is exceeded', () => {
    const beginningDate = new Date('2020-11-01')
    const endingDate = new Date('2020-11-30')

    const dateRange = computeDateRangeDisplay(beginningDate, endingDate)

    expect(dateRange).toBeNull()
  })
})

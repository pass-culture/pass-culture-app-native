import range from 'lodash/range'
import timezoneMock, { TimeZone } from 'timezone-mock'

import { getDatesInMonth } from 'features/bookOffer/components/Calendar/Calendar.utils'

describe('getDatesInMonth()', () => {
  it.each`
    timezone
    ${'Australia/Adelaide'}
    ${'Europe/London'}
    ${'Brazil/East'}
  `(
    'should return a list [1, 2, ..., N] for some specified month and year with timezone $timezone',
    ({ timezone }: { timezone: TimeZone }) => {
      timezoneMock.register(timezone)
      expect(getDatesInMonth(9, 2021)).toEqual(range(1, 31 + 1)) // october 2021 has 31 days
      expect(getDatesInMonth(10, 2021)).toEqual(range(1, 30 + 1)) // november 2021 has 30 days
      expect(getDatesInMonth(1, 2009)).toEqual(range(1, 28 + 1)) // february 2009 has 28 days
      expect(getDatesInMonth(1, 2008)).toEqual(range(1, 29 + 1)) // february 2008 has 29 days
    }
  )
})

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

      expect(getDatesInMonth(9, '2021')).toEqual(getArrayOfStrings(31)) // october 2021 has 31 days
      expect(getDatesInMonth(10, '2021')).toEqual(getArrayOfStrings(30)) // november 2021 has 30 days
      expect(getDatesInMonth(1, '2009')).toEqual(getArrayOfStrings(28)) // february 2009 has 28 days
      expect(getDatesInMonth(1, '2008')).toEqual(getArrayOfStrings(29)) // february 2008 has 29 days
    }
  )
})

function getArrayOfStrings(day: number): string[] {
  return Array.from({ length: day }, (_, i) => (i + 1).toString())
}

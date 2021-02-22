import { formatDate } from '../CancellationDetails'

describe('formatDate()', () => {
  it.each`
    limitDate                      | expected
    ${'2021-02-23T13:45:00'}       | ${'23 février 2021, 13h45'}
    ${new Date(2021, 4, 3, 9, 30)} | ${'3 mai 2021, 9h30'}
  `(
    'should format Date $limitDate to string "$expected"',
    ({ limitDate, expected }: { limitDate: Date; expected: string }) => {
      expect(formatDate(limitDate)).toEqual(expected)
    }
  )
})

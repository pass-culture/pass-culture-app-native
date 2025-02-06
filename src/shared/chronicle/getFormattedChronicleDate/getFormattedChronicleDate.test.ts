import { getFormattedChronicleDate } from 'shared/chronicle/getFormattedChronicleDate/getFormattedChronicleDate'

describe('getFormattedLongMonthYear', () => {
  it('should format chronicle date correctly in french and month first letter in capitals', () => {
    const result = getFormattedChronicleDate('2025-01-20T23:32:14.456451Z')

    expect(result).toEqual('Janvier 2025')
  })
})

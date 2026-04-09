import { getFormattedAdviceDate } from 'features/advices/helpers/getFormattedAdviceDate'

describe('getFormattedAdviceDate', () => {
  it('should format chronicle date correctly in french and month first letter in capitals', () => {
    const result = getFormattedAdviceDate('2025-01-20T23:32:14.456451Z')

    expect(result).toEqual('Janvier 2025')
  })
})

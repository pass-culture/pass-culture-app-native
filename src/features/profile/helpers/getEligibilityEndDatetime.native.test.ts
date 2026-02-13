import { formatToSlashedFrenchDate } from 'libs/dates'

import { getEligibilityEndDatetime } from './getEligibilityEndDatetime'

jest.mock('libs/dates')
const mockedFormat = formatToSlashedFrenchDate as jest.Mock

describe('getEligibilityEndDatetime', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should format and return the date when eligibilityEndDatetime is provided', () => {
    mockedFormat.mockReturnValueOnce('01/01/2025')
    const inputDate = '2025-01-01T10:00:00Z'
    const result = getEligibilityEndDatetime({ eligibilityEndDatetime: inputDate })

    expect(mockedFormat).toHaveBeenNthCalledWith(1, new Date(inputDate).toISOString())
    expect(result).toBe('01/01/2025')
  })

  it('should return undefined if eligibilityEndDatetime is null', () => {
    const result = getEligibilityEndDatetime({ eligibilityEndDatetime: null })

    expect(result).toBeUndefined()
    expect(mockedFormat).not.toHaveBeenCalled()
  })

  it('should return undefined if eligibilityEndDatetime is undefined', () => {
    const result = getEligibilityEndDatetime({})

    expect(result).toBeUndefined()
    expect(mockedFormat).not.toHaveBeenCalled()
  })
})

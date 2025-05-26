import { getMarkedDates } from 'features/search/helpers/getMarkedDates/getMarkedDates'
import { MarkedDatesColors } from 'features/search/types'

const colors: MarkedDatesColors = { backgroundColor: '#ffffff', textColor: '#cbcdd2' }

describe('getMarkedDates', () => {
  it('should return an empty object if no start date', () => {
    expect(getMarkedDates(undefined, undefined, colors)).toEqual(undefined)
  })

  it('should return single day marked if only start date', () => {
    const startDate = new Date('2025-04-28')
    const result = getMarkedDates(startDate, undefined, colors)

    expect(result).toEqual({
      '2025-04-28': {
        startingDay: true,
        endingDay: true,
        color: '#ffffff',
        textColor: '#cbcdd2',
      },
    })
  })

  it('should return correct range when start and end date are provided', () => {
    const startDate = new Date('2025-04-28')
    const endDate = new Date('2025-04-30')

    const result = getMarkedDates(startDate, endDate, colors)

    expect(result).toEqual({
      '2025-04-28': {
        startingDay: true,
        endingDay: false,
        color: '#ffffff',
        textColor: '#cbcdd2',
      },
      '2025-04-29': {
        startingDay: false,
        endingDay: false,
        color: '#ffffff',
        textColor: '#cbcdd2',
      },
      '2025-04-30': {
        startingDay: false,
        endingDay: true,
        color: '#ffffff',
        textColor: '#cbcdd2',
      },
    })
  })
})

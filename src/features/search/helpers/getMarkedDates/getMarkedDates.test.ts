import { getMarkedDates } from 'features/search/helpers/getMarkedDates/getMarkedDates'

const colors = { primary: 'blue', white: 'white' }

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
        color: 'blue',
        textColor: 'white',
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
        color: 'blue',
        textColor: 'white',
      },
      '2025-04-29': {
        startingDay: false,
        endingDay: false,
        color: 'blue',
        textColor: 'white',
      },
      '2025-04-30': {
        startingDay: false,
        endingDay: true,
        color: 'blue',
        textColor: 'white',
      },
    })
  })
})

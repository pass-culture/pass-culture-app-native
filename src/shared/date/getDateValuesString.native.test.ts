import { getDateValuesString } from './getDateValuesString'

describe('getDateValuesString', () => {
  it('should return an object with day, month and year as strings with the date values', () => {
    const selectedDate = new Date('2022-01-31T12:00:00.000Z')
    const expectedOutput = { day: '31', month: 'Janv.', year: '2022' }
    const result = getDateValuesString(selectedDate)
    expect(result).toEqual(expectedOutput)
  })
})

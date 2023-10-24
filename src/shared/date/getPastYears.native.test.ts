import { getPastYears } from './getPastYears'

describe('getPastYears', () => {
  it('should return an array of years as strings in descending order', () => {
    const startYear = 2015
    const currentYear = '2023'
    const expectedOutput = ['2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015']
    const result = getPastYears(startYear, currentYear)

    expect(result).toEqual(expectedOutput)
  })

  it('should return an empty array if startYear is greater than currentYear', () => {
    const startYear = 2023
    const currentYear = '2022'
    const expectedOutput: string[] = []
    const result = getPastYears(startYear, currentYear)

    expect(result).toEqual(expectedOutput)
  })

  it('should return an empty array if currentYear is not a valid number', () => {
    const startYear = 2015
    const currentYear = 'not a number'
    const expectedOutput: string[] = []
    const result = getPastYears(startYear, currentYear)

    expect(result).toEqual(expectedOutput)
  })

  it('should handle startYear as a negative value', () => {
    const startYear = -5
    const currentYear = '5'
    const expectedOutput = ['5', '4', '3', '2', '1', '0', '-1', '-2', '-3', '-4', '-5']
    const result = getPastYears(startYear, currentYear)

    expect(result).toEqual(expectedOutput)
  })
})

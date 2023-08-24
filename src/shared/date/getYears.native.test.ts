import { getYears } from './getYears'

describe('getYears', () => {
  it('should return an array of years as strings', () => {
    const startYear = 2020
    const numberOfYears = 3
    const expectedOutput = ['2020', '2021', '2022']
    const result = getYears(startYear, numberOfYears)
    expect(result).toEqual(expectedOutput)
  })

  it('should return an empty array if numberOfYears is zero', () => {
    const startYear = 2020
    const numberOfYears = 0
    const expectedOutput: string[] = []
    const result = getYears(startYear, numberOfYears)
    expect(result).toEqual(expectedOutput)
  })

  it('should not handle negative values of numberOfYears', () => {
    const startYear = 2020
    const numberOfYears = -3
    const expectedOutput: string[] = []
    const result = getYears(startYear, numberOfYears)
    expect(result).toEqual(expectedOutput)
  })

  it('should handle startYear as a negative value', () => {
    const startYear = -5
    const numberOfYears = 5
    const expectedOutput = ['-5', '-4', '-3', '-2', '-1']
    const result = getYears(startYear, numberOfYears)
    expect(result).toEqual(expectedOutput)
  })
})

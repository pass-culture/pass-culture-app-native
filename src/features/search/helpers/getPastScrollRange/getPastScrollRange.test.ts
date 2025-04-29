import { getPastScrollRange } from 'features/search/helpers/getPastScrollRange/getPastScrollRange'

describe('getPastScrollRange', () => {
  it('should return 0 if from and to are the same month', () => {
    const from = new Date(2024, 3, 15) // 15 April 2024
    const to = new Date(2024, 3, 1) // 1 April 2024

    expect(getPastScrollRange(from, to)).toEqual(0)
  })

  it('should return positive difference in months if from is after to', () => {
    const from = new Date(2024, 3, 1) // 1 April 2024
    const to = new Date(2024, 0, 10) // 10 Jan 2024

    expect(getPastScrollRange(from, to)).toEqual(3)
  })

  it('should return 0 if from is before to', () => {
    const from = new Date(2024, 3, 1) // 1 April 2024
    const to = new Date(2024, 5, 10) // 10 June 2024

    expect(getPastScrollRange(from, to)).toEqual(0)
  })

  it('should return correct diff when from is on the last day of a month', () => {
    const from = new Date(2024, 3, 1) // 1 April 2024
    const to = new Date(2024, 1, 29) // 29 Feb 2024

    expect(getPastScrollRange(from, to)).toEqual(2)
  })

  it('should return correct diff when years are different', () => {
    const from = new Date(2024, 3, 1) // 1 April 2024
    const to = new Date(2023, 10, 1) // 1 Nov 2023

    expect(getPastScrollRange(from, to)).toEqual(5)
  })
})

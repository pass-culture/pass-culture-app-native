import { getDates } from 'shared/date/getDates'

describe('getDates', () => {
  it('should return an array of dates with the correct length', () => {
    const start = new Date(2021, 0, 1)
    const count = 5
    const result = getDates(start, count)

    expect(result).toHaveLength(count)
  })

  it('should return an array of dates with the correct values', () => {
    const start = new Date(2021, 0, 1)
    const count = 5
    const result = getDates(start, count)

    expect(result).toEqual([
      new Date(2021, 0, 1),
      new Date(2021, 0, 2),
      new Date(2021, 0, 3),
      new Date(2021, 0, 4),
      new Date(2021, 0, 5),
    ])
  })
})

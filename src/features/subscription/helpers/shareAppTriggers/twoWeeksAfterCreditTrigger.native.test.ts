import { twoWeeksAfterCreditTrigger } from './twoWeeksAfterCreditTrigger'

describe('Two weeks after credit trigger', () => {
  it('should be true when credit was received more than two weeks ago', () => {
    const currentDate = new Date('2024-07-26T12:00:00')
    const twoWeeksAnd1HourBeforeCurrentDate = new Date('2024-07-12T11:00:00')
    const trigger = twoWeeksAfterCreditTrigger({
      currentDate,
      firstCreditDate: twoWeeksAnd1HourBeforeCurrentDate,
    })

    expect(trigger()).toBe(true)
  })

  it('should be false  when credit was received less than 2 weeks ago', () => {
    const currentDate = new Date('2024-07-26T12:00:00')
    const oneWeekBeforeCurrentDate = new Date('2024-07-19T12:00:00')
    const trigger = twoWeeksAfterCreditTrigger({
      currentDate,
      firstCreditDate: oneWeekBeforeCurrentDate,
    })

    expect(trigger()).toBe(false)
  })

  it('should be false  when credit was NOT received', () => {
    const currentDate = new Date('2024-07-26T12:00:00')
    const trigger = twoWeeksAfterCreditTrigger({
      currentDate,
      firstCreditDate: undefined,
    })

    expect(trigger()).toBe(false)
  })
})

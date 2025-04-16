import { GetRemindersResponse } from 'api/gen'
import { remindersResponse } from 'features/offer/fixtures/remindersResponse'
import { selectReminderByOfferId } from 'features/offer/queries/selectors/selectReminderByOfferId'

describe('selectReminderByOfferId', () => {
  it('should return the correct reminder when a matching offer ID is found', () => {
    const result = selectReminderByOfferId(remindersResponse, 10)

    expect(result).toBeDefined()
    expect(result).toEqual(remindersResponse.reminders[0])
  })

  it('should return undefined when no matching offer ID is found', () => {
    const result = selectReminderByOfferId(remindersResponse, 4321)

    expect(result).toBeUndefined()
  })

  it('should return undefined when the input data is an empty object', () => {
    const emptyData: GetRemindersResponse = { reminders: [] }
    const result = selectReminderByOfferId(emptyData, 10)

    expect(result).toBeUndefined()
  })
})

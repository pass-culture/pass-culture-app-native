import * as API from 'api/api'
import { remindersResponse } from 'features/offer/fixtures/remindersResponse'
import { GetReminderResponse } from 'features/offer/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { useGetRemindersQuery } from './useGetRemindersQuery'

const mockGetReminders = jest.spyOn(API.api, 'getNativeV1MeReminders')

describe('useGetRemindersQuery', () => {
  beforeEach(() => mockGetReminders.mockResolvedValueOnce(remindersResponse))

  it('should call the correct API endpoint', async () => {
    renderUseGetRemindersQuery()

    await act(async () => {})

    expect(mockGetReminders).toHaveBeenCalledTimes(1)
  })

  it('should allow selecting a subset of data', async () => {
    const { result } = renderUseGetRemindersQuery((data) =>
      data.reminders.find((r) => r.id === remindersResponse.reminders[0]?.id)
    )

    await act(async () => {})

    expect(result.current.data).toEqual(remindersResponse.reminders[0])
  })
})

const renderUseGetRemindersQuery = <TData = GetReminderResponse>(
  select?: (data: GetReminderResponse) => TData
) =>
  renderHook(() => useGetRemindersQuery(select), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

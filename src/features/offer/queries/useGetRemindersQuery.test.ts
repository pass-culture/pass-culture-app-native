import { remindersResponse } from 'features/offer/fixtures/remindersResponse'
import { GetReminderResponse } from 'features/offer/types'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { useGetRemindersQuery } from './useGetRemindersQuery'

jest.mock('libs/jwt/jwt')

describe('useGetRemindersQuery', () => {
  beforeEach(() => {
    mockServer.getApi<GetReminderResponse>('/v1/me/reminders', remindersResponse)
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

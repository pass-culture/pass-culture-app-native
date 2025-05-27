import { GetRemindersResponse } from 'api/gen'
import { remindersResponse } from 'features/offer/fixtures/remindersResponse'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { useGetRemindersQuery } from './useGetRemindersQuery'

jest.mock('libs/jwt/jwt')
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: jest.fn(() => ({ isLoggedIn: true })),
}))

describe('useGetRemindersQuery', () => {
  beforeEach(() => mockServer.getApi<GetRemindersResponse>('/v1/me/reminders', remindersResponse))

  it('should only fetch data if user is loogedIn', async () => {
    const { result } = renderUseGetRemindersQuery()

    expect(result.current.isFetching).toEqual(true)

    await act(async () => {})
    await act(async () => {})

    expect(result.current.data?.reminders.length).toEqual(remindersResponse.reminders.length)
  })

  it('should allow selecting a subset of data', async () => {
    const { result } = renderUseGetRemindersQuery((data) =>
      data.reminders.find((r) => r.id === remindersResponse.reminders[0]?.id)
    )

    await act(async () => {})
    await act(async () => {})

    expect(result.current.data).toEqual(remindersResponse.reminders[0])
  })
})

const renderUseGetRemindersQuery = <TData = GetRemindersResponse>(
  select?: (data: GetRemindersResponse) => TData
) =>
  renderHook(() => useGetRemindersQuery(select), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

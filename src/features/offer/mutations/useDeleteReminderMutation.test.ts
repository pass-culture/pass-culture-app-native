import { QueryClient } from 'react-query'

import { remindersResponse } from 'features/offer/fixtures/remindersResponse'
import { GetReminderResponse } from 'features/offer/types'
import { QueryKeys } from 'libs/queryKeys'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { useDeleteReminderMutation } from './useDeleteReminderMutation'

jest.mock('libs/jwt/jwt')

const reminderId = 1

const cancelQueriesMock = jest.fn()

let queryClient: QueryClient
const setupWithReminders = (client: QueryClient) => {
  queryClient = client
  queryClient.setQueryData([QueryKeys.REMINDERS], remindersResponse)
  queryClient.cancelQueries = cancelQueriesMock
}
const expectedRemindersInCache = [
  {
    id: 2,
    offer: { id: 20 },
  },
]

describe('useDeleteReminderMutation', () => {
  beforeEach(() => {
    mockServer.getApi<GetReminderResponse>('/v1/me/reminders', remindersResponse)
    mockServer.deleteApi(`/v1/me/reminders/${reminderId}`, {
      responseOptions: { statusCode: 201, data: {} },
    })

    jest.clearAllMocks()
  })

  it('should update the query cache optimistically on mutation', async () => {
    const { result } = renderUseDeleteReminderMutation()

    expect(queryClient.getQueryData([QueryKeys.REMINDERS])).toEqual(remindersResponse)

    await act(async () => {
      result.current.mutate(reminderId)
    })

    expect(cancelQueriesMock).toHaveBeenCalledWith([QueryKeys.REMINDERS])

    const updatedCache = queryClient.getQueryData<GetReminderResponse>([QueryKeys.REMINDERS])

    expect(updatedCache?.reminders).toEqual(expectedRemindersInCache)
  })

  it('should revert the cache if mutation fails', async () => {
    const onErrorMock = jest.fn()
    mockServer.deleteApi(`/v1/me/reminders/${reminderId}`, {
      responseOptions: { statusCode: 500, data: { message: 'Server error' } },
    })

    const { result } = renderUseDeleteReminderMutation({ onError: onErrorMock })

    expect(queryClient.getQueryData([QueryKeys.REMINDERS])).toEqual(remindersResponse)

    await act(async () => {
      result.current.mutate(reminderId)
    })

    const cacheAfterError = queryClient.getQueryData<GetReminderResponse>([QueryKeys.REMINDERS])

    expect(cacheAfterError).toEqual(remindersResponse)
    expect(onErrorMock).toHaveBeenCalledTimes(1)
  })
})

const renderUseDeleteReminderMutation = (
  options?: Parameters<typeof useDeleteReminderMutation>[0]
) =>
  renderHook(() => useDeleteReminderMutation(options), {
    wrapper: ({ children }) => reactQueryProviderHOC(children, setupWithReminders),
  })

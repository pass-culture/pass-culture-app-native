import { QueryClient } from '@tanstack/react-query'

import { GetRemindersResponse } from 'api/gen'
import { remindersResponse } from 'features/offer/fixtures/remindersResponse'
import { QueryKeys } from 'libs/queryKeys'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { useDeleteReminderMutation } from './useDeleteReminderMutation'

jest.mock('libs/jwt/jwt')

const reminderId = 1

const cancelQueriesMock = jest.fn()
const invalidateQueriesMock = jest.fn()

let queryClient: QueryClient
const setupWithReminders = (client: QueryClient) => {
  queryClient = client
  queryClient.setQueryData([QueryKeys.REMINDERS], remindersResponse)
  queryClient.cancelQueries = cancelQueriesMock
  queryClient.invalidateQueries = invalidateQueriesMock
}

describe('useDeleteReminderMutation', () => {
  beforeEach(() => {
    mockServer.getApi<GetRemindersResponse>('/v1/me/reminders', remindersResponse)
    mockServer.deleteApi(`/v1/me/reminders/${reminderId}`, {
      responseOptions: { statusCode: 201, data: {} },
    })

    jest.clearAllMocks()
  })

  it('should update the query cache optimistically on mutation', async () => {
    const expectedRemindersInCache = [
      {
        id: 2,
        offer: { id: 20 },
      },
    ]

    const { result } = renderUseDeleteReminderMutation()

    expect(queryClient.getQueryData([QueryKeys.REMINDERS])).toEqual(remindersResponse)

    await act(async () => {
      result.current.mutate(reminderId)
    })

    expect(cancelQueriesMock).toHaveBeenCalledWith([QueryKeys.REMINDERS])

    const updatedCache = queryClient.getQueryData<GetRemindersResponse>([QueryKeys.REMINDERS])

    expect(updatedCache?.reminders).toEqual(expectedRemindersInCache)
  })

  it('should revert the cache if mutation fails', async () => {
    const doRevertCache = jest.fn(() =>
      queryClient.getQueryData<GetRemindersResponse>([QueryKeys.REMINDERS])
    )

    mockServer.deleteApi(`/v1/me/reminders/${reminderId}`, {
      responseOptions: { statusCode: 500, data: { message: 'Server error' } },
    })

    const { result } = renderUseDeleteReminderMutation({ onError: doRevertCache })

    expect(queryClient.getQueryData([QueryKeys.REMINDERS])).toEqual(remindersResponse)

    await act(async () => {
      result.current.mutate(reminderId)
    })

    expect(doRevertCache).toHaveBeenCalledTimes(1)
  })

  it('should invalidate reminders query after successful mutation', async () => {
    const { result } = renderUseDeleteReminderMutation()

    await act(async () => {
      result.current.mutate(reminderId)
    })

    await act(async () => expect(result.current.isSuccess).toBe(true))

    expect(invalidateQueriesMock).toHaveBeenCalledWith([QueryKeys.REMINDERS])
  })

  it('should invalidate reminders query after mutation fails', async () => {
    mockServer.deleteApi(`/v1/me/reminders/${reminderId}`, {
      responseOptions: { statusCode: 500, data: { message: 'Server error' } },
    })

    const { result } = renderUseDeleteReminderMutation()

    await act(async () => {
      result.current.mutate(reminderId)
    })

    await act(async () => expect(result.current.isSuccess).toBe(false))

    expect(invalidateQueriesMock).toHaveBeenCalledWith([QueryKeys.REMINDERS])
  })
})

const renderUseDeleteReminderMutation = (
  options?: Parameters<typeof useDeleteReminderMutation>[0]
) =>
  renderHook(() => useDeleteReminderMutation(options), {
    wrapper: ({ children }) => reactQueryProviderHOC(children, setupWithReminders),
  })

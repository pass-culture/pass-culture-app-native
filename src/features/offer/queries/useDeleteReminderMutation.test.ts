import { QueryClient } from '@tanstack/react-query'

import { GetRemindersResponse } from 'api/gen'
import { remindersResponse } from 'features/offer/fixtures/remindersResponse'
import { QueryKeys } from 'libs/queryKeys'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

import { useDeleteReminderMutation } from './useDeleteReminderMutation'

jest.mock('libs/jwt/jwt')

const reminderId = 1
let queryClient: QueryClient

const setupWithReminders = (client: QueryClient) => {
  queryClient = client
  queryClient.setQueryData([QueryKeys.REMINDERS], remindersResponse)
  jest.spyOn(queryClient, 'cancelQueries')
  jest.spyOn(queryClient, 'invalidateQueries')
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

    expect(queryClient.cancelQueries).toHaveBeenCalledWith({ queryKey: [QueryKeys.REMINDERS] })

    const updatedCache = queryClient.getQueryData<GetRemindersResponse>([QueryKeys.REMINDERS])

    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

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

    await waitFor(async () => expect(result.current.isSuccess).toEqual(false))

    expect(doRevertCache).toHaveBeenCalledTimes(1)
  })

  it('should invalidate reminders query after successful mutation', async () => {
    const { result } = renderUseDeleteReminderMutation()

    await act(async () => {
      result.current.mutate(reminderId)
    })

    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: [QueryKeys.REMINDERS] })
  })

  it('should invalidate reminders query after mutation fails', async () => {
    mockServer.deleteApi(`/v1/me/reminders/${reminderId}`, {
      responseOptions: { statusCode: 500, data: { message: 'Server error' } },
    })

    const { result } = renderUseDeleteReminderMutation()

    await act(async () => {
      result.current.mutate(reminderId)
    })

    await waitFor(async () => expect(result.current.isSuccess).toEqual(false))

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: [QueryKeys.REMINDERS] })
  })
})

const renderUseDeleteReminderMutation = (
  options?: Parameters<typeof useDeleteReminderMutation>[0]
) =>
  renderHook(() => useDeleteReminderMutation(options), {
    wrapper: ({ children }) => reactQueryProviderHOC(children, setupWithReminders),
  })

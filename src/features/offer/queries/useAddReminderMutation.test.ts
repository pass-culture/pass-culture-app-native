import { QueryClient } from '@tanstack/react-query'

import { GetRemindersResponse } from 'api/gen'
import { reminder, remindersResponse } from 'features/offer/fixtures/remindersResponse'
import { QueryKeys } from 'libs/queryKeys'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

import { useAddReminderMutation } from './useAddReminderMutation'

jest.mock('libs/jwt/jwt')

const offerId = 30
const reminderIdMock = 0

const cancelQueriesMock = jest.fn()
const invalidateQueriesMock = jest.fn()

let queryClient: QueryClient
const setupWithReminders = (client: QueryClient) => {
  queryClient = client
  queryClient.setQueryData([QueryKeys.REMINDERS], remindersResponse)
  queryClient.cancelQueries = cancelQueriesMock
  queryClient.invalidateQueries = invalidateQueriesMock
}

describe('useAddReminderMutation', () => {
  beforeEach(() => {
    mockServer.getApi<GetRemindersResponse>('/v1/me/reminders', remindersResponse)
    mockServer.postApi(`/v1/me/reminders`, {
      responseOptions: { statusCode: 201, data: reminder },
    })

    jest.clearAllMocks()
  })

  afterEach(() => jest.spyOn(global.Math, 'random').mockRestore())

  it('should update the query cache optimistically on mutation', async () => {
    const expectedRemindersInCache = [
      ...remindersResponse.reminders,
      {
        id: reminderIdMock,
        offer: { id: offerId },
      },
    ]

    const { result } = renderUseAddReminderMutation()

    expect(queryClient.getQueryData([QueryKeys.REMINDERS])).toEqual(remindersResponse)

    await act(async () => {
      result.current.mutate(offerId)
    })

    expect(cancelQueriesMock).toHaveBeenCalledWith({ queryKey: [QueryKeys.REMINDERS] })

    const updatedCache = queryClient.getQueryData<GetRemindersResponse>([QueryKeys.REMINDERS])

    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(updatedCache?.reminders).toEqual(expectedRemindersInCache)
  })

  it('should revert the cache if mutation fails', async () => {
    const doRevertCache = jest.fn(() =>
      queryClient.getQueryData<GetRemindersResponse>([QueryKeys.REMINDERS])
    )

    mockServer.postApi(`/v1/me/reminders`, {
      responseOptions: { statusCode: 500, data: { message: 'Server error' } },
    })

    const { result } = renderUseAddReminderMutation({ onError: doRevertCache })

    expect(queryClient.getQueryData([QueryKeys.REMINDERS])).toEqual(remindersResponse)

    await act(async () => {
      result.current.mutate(offerId)
    })

    await waitFor(async () => expect(result.current.isSuccess).toEqual(false))

    expect(doRevertCache).toHaveBeenCalledTimes(1)
  })

  it('should invalidate reminders query after successful mutation', async () => {
    const { result } = renderUseAddReminderMutation()

    await act(async () => {
      result.current.mutate(offerId)
    })

    await act(async () => expect(result.current.isSuccess).toBe(true))

    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: [QueryKeys.REMINDERS] })
  })

  it('should invalidate reminders query after mutation fails', async () => {
    mockServer.postApi(`/v1/me/reminders`, {
      responseOptions: { statusCode: 500, data: { message: 'Server error' } },
    })

    const { result } = renderUseAddReminderMutation()

    await act(async () => {
      result.current.mutate(offerId)
    })

    await act(async () => expect(result.current.isSuccess).toBe(false))

    await waitFor(async () => expect(result.current.isSuccess).toEqual(false))

    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: [QueryKeys.REMINDERS] })
  })
})

const renderUseAddReminderMutation = (options?: Parameters<typeof useAddReminderMutation>[0]) =>
  renderHook(() => useAddReminderMutation(options), {
    wrapper: ({ children }) => reactQueryProviderHOC(children, setupWithReminders),
  })

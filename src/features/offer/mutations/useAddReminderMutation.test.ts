import * as API from 'api/api'
import { reminder } from 'features/offer/fixtures/remindersResponse'
import { QueryKeys } from 'libs/queryKeys'
import { queryClient } from 'libs/react-query/queryClient'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { useAddReminderMutation } from './useAddReminderMutation'

const mockPostReminders = jest.spyOn(API.api, 'postNativeV1MeReminders')
const mockInvalidateQueries = jest.spyOn(queryClient, 'invalidateQueries')

const offerId = 10
const mockOnSuccess = jest.fn()

describe('useAddReminderMutation', () => {
  beforeEach(() => {
    mockPostReminders.mockClear()
    mockInvalidateQueries.mockClear()
  })

  it('should call the correct API endpoint', async () => {
    mockPostReminders.mockResolvedValueOnce(reminder)

    const { result } = renderUseAddReminderMutation()

    await act(async () => {
      result.current.mutate(offerId)
    })

    expect(mockPostReminders).toHaveBeenCalledWith({ offerId })
    expect(mockPostReminders).toHaveBeenCalledTimes(1)
  })

  it('should invalidate reminders query on successful mutation', async () => {
    mockPostReminders.mockResolvedValueOnce(reminder)

    const { result } = renderUseAddReminderMutation()

    await act(async () => {
      result.current.mutate(offerId)
    })

    expect(mockInvalidateQueries).toHaveBeenCalledWith(QueryKeys.REMINDERS)
    expect(mockInvalidateQueries).toHaveBeenCalledTimes(1)
  })

  it('should call custom onSuccess callback when provided', async () => {
    mockPostReminders.mockResolvedValueOnce(reminder)

    const { result } = renderUseAddReminderMutation({ onSuccess: mockOnSuccess })

    await act(async () => {
      result.current.mutate(offerId)
    })

    expect(mockOnSuccess).toHaveBeenCalledTimes(1)
  })

  it('should handle mutation error', async () => {
    const mockError = new Error('Mutation failed')
    mockPostReminders.mockRejectedValueOnce(mockError)

    const { result } = renderUseAddReminderMutation()

    await act(async () => {
      result.current.mutate(offerId)
    })

    expect(result.current.isError).toBe(true)
    expect(result.current.error).toBe(mockError)
  })
})

const renderUseAddReminderMutation = (options?: Parameters<typeof useAddReminderMutation>[0]) =>
  renderHook(() => useAddReminderMutation(options), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

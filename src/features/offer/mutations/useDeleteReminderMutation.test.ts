import { api } from 'api/api'
import { remindersResponse } from 'features/offer/fixtures/remindersResponse'
import { queryClient } from 'libs/react-query/queryClient'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

import { useDeleteReminderMutation } from './useDeleteReminderMutation'

const mockDeleteReminder = jest.spyOn(api, 'deleteNativeV1MeRemindersreminderId')
const mockGetQueryData = jest.spyOn(queryClient, 'getQueryData')

const reminderId = 1

describe('useDeleteReminderMutation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call the correct API endpoint', async () => {
    mockDeleteReminder.mockResolvedValueOnce({})

    const { result } = renderUseDeleteReminderMutation()

    await act(async () => {
      result.current.mutate(reminderId)
    })

    expect(mockDeleteReminder).toHaveBeenCalledWith(reminderId)
    expect(mockDeleteReminder).toHaveBeenCalledTimes(1)
  })

  it('should call custom onSuccess callback when provided', async () => {
    const mockOnSuccess = jest.fn()
    mockDeleteReminder.mockResolvedValueOnce({})
    mockGetQueryData.mockReturnValueOnce(remindersResponse)

    const { result } = renderUseDeleteReminderMutation({ onSuccess: mockOnSuccess })

    await act(async () => {
      result.current.mutate(reminderId)
    })

    expect(mockOnSuccess).toHaveBeenCalledTimes(1)
  })

  it('should handle mutation error', async () => {
    const mockError = new Error('Deletion failed')
    mockDeleteReminder.mockRejectedValueOnce(mockError)
    mockGetQueryData.mockReturnValueOnce(remindersResponse)

    const { result } = renderUseDeleteReminderMutation()

    await act(async () => {
      result.current.mutate(reminderId)
    })

    expect(result.current.isError).toBe(true)
    expect(result.current.error).toBe(mockError)
  })
})

const renderUseDeleteReminderMutation = (
  options?: Parameters<typeof useDeleteReminderMutation>[0]
) =>
  renderHook(() => useDeleteReminderMutation(options), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

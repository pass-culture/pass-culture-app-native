import { useQueryClient, useMutation } from 'react-query'

import { api } from 'api/api'
import { QueryKeys } from 'libs/queryKeys'

import { useCancelBookingMutation } from './useCancelBookingMutation'

jest.mock('api/api')
jest.mock('react-query')

describe('[hook] useCancelBookingMutation', () => {
  const onSuccess = jest.fn()
  const onError = jest.fn()
  const queryClient = useQueryClient()

  it('use useMutation', () => {
    useCancelBookingMutation({ onSuccess, onError })
    expect(useMutation).toHaveBeenCalledWith(expect.any(Function), {
      onSuccess: expect.any(Function),
      onError: expect.any(Function),
    })
  })

  it('invalidates me and bookings after successfully cancel a booking', () => {
    const returnedMutationValue = useCancelBookingMutation({ onSuccess, onError })
    // @ts-expect-error returned value is mocked
    const { mutationOptions } = returnedMutationValue
    mutationOptions.onSuccess()
    expect(onSuccess).toHaveBeenCalledWith()
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith([QueryKeys.USER_PROFILE])
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith([QueryKeys.BOOKINGS])
  })

  it('call api to cancel a booking', () => {
    const returnedMutationValue = useCancelBookingMutation({ onSuccess, onError })
    // @ts-expect-error returned value is mocked
    const { mutationFunction } = returnedMutationValue
    mutationFunction('bookingId')
    expect(api.postnativev1bookingsbookingIdcancel).toHaveBeenCalledWith('bookingId')
  })
  it('call onError input after cancel a booking on error', () => {
    const returnedMutationValue = useCancelBookingMutation({ onSuccess, onError })
    // @ts-expect-error returned value is mocked
    const { mutationOptions } = returnedMutationValue
    mutationOptions.onError()
    expect(onError).toHaveBeenCalledWith()
  })
})

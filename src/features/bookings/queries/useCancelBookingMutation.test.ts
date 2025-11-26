import { QueryClient } from '@tanstack/react-query'

import { QueryKeys } from 'libs/queryKeys'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook, waitFor } from 'tests/utils'

import { useCancelBookingMutation } from './useCancelBookingMutation'

const BOOKING_OFFER_ID = 1

const onSuccess = jest.fn()
const onError = jest.fn()
const invalidateQueriesMock = jest.fn()

let queryClient: QueryClient
const setupQueryClient = (client: QueryClient) => {
  queryClient = client
  queryClient.invalidateQueries = invalidateQueriesMock
}

jest.mock('libs/jwt/jwt')

describe('[hook] useCancelBookingMutation', () => {
  it('invalidates me and bookings after successfully cancel a booking', async () => {
    mockServer.postApi(`/v1/bookings/${BOOKING_OFFER_ID}/cancel`, {})

    const { result } = renderUseCancelBookingMutation()

    await act(async () => result.current.mutate(BOOKING_OFFER_ID))

    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(onSuccess).toHaveBeenCalledTimes(1)
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: [QueryKeys.USER_PROFILE] })
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: [QueryKeys.BOOKINGS] })
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: [QueryKeys.BOOKINGSV2] })
    expect(invalidateQueriesMock).toHaveBeenCalledWith({ queryKey: [QueryKeys.BOOKINGSLIST] })
  })

  it('call onError input after cancel a booking on error', async () => {
    mockServer.postApi(`/v1/bookings/${BOOKING_OFFER_ID}/cancel`, {
      responseOptions: { statusCode: 400 },
    })

    const { result } = renderUseCancelBookingMutation()
    await act(async () => result.current.mutate(BOOKING_OFFER_ID))

    expect(onError).toHaveBeenCalledTimes(1)
  })
})

const renderUseCancelBookingMutation = () =>
  renderHook(() => useCancelBookingMutation({ onSuccess, onError }), {
    wrapper: ({ children }) => reactQueryProviderHOC(children, setupQueryClient),
  })

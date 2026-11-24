import { api } from 'api/api'
import { BookingResponse } from 'api/gen'
import { beneficiaryUser } from 'fixtures/user'
import { useBookingByIdQuery } from 'queries/bookings/useBookingByIdQuery'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

describe('useBookingByIdQuery', () => {
  it('should fetch the booking details from the V2 endpoint', async () => {
    mockAuthContextWithUser(beneficiaryUser, { persist: true })
    const getBookingById = jest
      .spyOn(api, 'getNativeV2BookingsbookingId')
      .mockResolvedValueOnce({} as BookingResponse)

    const { result } = renderHook(() => useBookingByIdQuery(123), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => expect(result.current.isSuccess).toEqual(true))
    await waitFor(() => expect(getBookingById).toHaveBeenCalledWith(123))
  })

  it('should not fetch when user is not logged in', () => {
    mockAuthContextWithoutUser({ persist: true })

    const { result } = renderHook(() => useBookingByIdQuery(123), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.isFetching).toEqual(false)
    expect(result.current.fetchStatus).toEqual('idle')
  })
})

import { api } from 'api/api'
import { BookingResponseV3 } from 'api/gen'
import { beneficiaryUser } from 'fixtures/user'
import { useBookingByIdV3Query } from 'queries/bookings/useBookingByIdV3Query'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

describe('useBookingByIdV3Query', () => {
  it('should fetch the booking details from the V3 endpoint', async () => {
    mockAuthContextWithUser(beneficiaryUser, { persist: true })
    const getBookingById = jest
      .spyOn(api, 'getNativeV3BookingsbookingId')
      .mockResolvedValueOnce({} as BookingResponseV3)

    const { result } = renderHook(() => useBookingByIdV3Query(123), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(() => expect(result.current.isSuccess).toEqual(true))
    await waitFor(() => expect(getBookingById).toHaveBeenCalledWith(123))
  })

  it('should not fetch when user is not logged in', () => {
    mockAuthContextWithoutUser({ persist: true })

    const { result } = renderHook(() => useBookingByIdV3Query(123), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.isFetching).toEqual(false)
    expect(result.current.fetchStatus).toEqual('idle')
  })
})

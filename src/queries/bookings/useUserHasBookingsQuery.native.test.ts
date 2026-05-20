import { BookingsResponseV2 } from 'api/gen'
import { bookingsSnapV2 } from 'features/bookings/fixtures'
import { beneficiaryUser } from 'fixtures/user'
import { useUserHasBookingsQueryV2 } from 'queries/bookings/useUserHasBookingsQuery'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/jwt/jwt')
const mockUseAuthContext = jest.fn().mockReturnValue({ user: beneficiaryUser })
jest.mock('features/auth/context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

describe('useUserHasBookingsQueryV2', () => {
  it('should return false if bookings do not exist', async () => {
    mockServer.getApi<BookingsResponseV2>('/v2/bookings', <BookingsResponseV2>{})
    const { result } = renderHook(() => useUserHasBookingsQueryV2(true), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(result.current?.data).toEqual(false)
  })

  it('should return true if bookings exist', async () => {
    mockServer.getApi<BookingsResponseV2>('/v2/bookings', bookingsSnapV2)
    const { result } = renderHook(() => useUserHasBookingsQueryV2(true), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(result.current?.data).toEqual(true)
  })
})

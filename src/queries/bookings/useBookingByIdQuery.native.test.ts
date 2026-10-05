import { useBookingByIdQuery } from 'queries/bookings/useBookingByIdQuery'
import { mockAuthContextWithoutUser } from 'tests/AuthContextUtils'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/jwt/jwt')

describe('useBookingByIdQuery', () => {
  it('should not fetch when user is not logged in', () => {
    mockAuthContextWithoutUser({ persist: true })

    const { result } = renderHook(() => useBookingByIdQuery(123), {
      wrapper: ({ children }) => reactQueryProviderHOC(children),
    })

    expect(result.current.isFetching).toEqual(false)
    expect(result.current.fetchStatus).toEqual('idle')
  })
})

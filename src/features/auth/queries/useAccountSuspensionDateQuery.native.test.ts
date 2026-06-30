import { UserSuspensionDateResponse } from 'api/gen'
import { useAccountSuspensionDateQuery } from 'features/auth/queries/useAccountSuspensionDateQuery'
import { beneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('features/auth/context/AuthContext')
jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/jwt/jwt')

const expectedResponse = { date: '2022-05-11T10:29:25.332786Z' }
const simulateSuspensionDate200 = () => {
  mockServer.getApi<UserSuspensionDateResponse>('/v1/account/suspension_date', expectedResponse)
}

const simulateSuspensionDateActiveAccount = () => {
  mockServer.getApi<UserSuspensionDateResponse>('/v1/account/suspension_date', {
    responseOptions: { statusCode: 403 },
  })
}

mockAuthContextWithUser({
  ...beneficiaryUser,
})

describe('useAccountSuspensionDate', () => {
  it('should return suspension date if it exists', async () => {
    simulateSuspensionDate200()
    const { result } = renderSuspensionDateHook()

    await waitFor(async () => expect(result.current.isFetched).toEqual(true))

    expect(result.current.data?.date).toBe(expectedResponse.date)
  })

  it('should return undefined for unsuspended user', async () => {
    simulateSuspensionDateActiveAccount()
    const { result, unmount } = renderSuspensionDateHook()

    expect(result.current.data).toBeUndefined()

    unmount()
  })

  it('should only fetch data when user is logged in', async () => {
    mockAuthContextWithoutUser()
    simulateSuspensionDate200()
    const { result } = renderSuspensionDateHook()

    await waitFor(async () => expect(result.current.isFetched).toEqual(false))
    await waitFor(async () => expect(result.current.isEnabled).toEqual(false))
  })
})

const renderSuspensionDateHook = () =>
  renderHook(() => useAccountSuspensionDateQuery(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

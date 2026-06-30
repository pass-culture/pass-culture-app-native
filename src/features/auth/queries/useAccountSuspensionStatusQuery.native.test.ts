import { AccountState, UserSuspensionStatusResponse } from 'api/gen'
import { useAccountSuspensionStatusQuery } from 'features/auth/queries/useAccountSuspensionStatusQuery'
import { beneficiaryUser } from 'fixtures/user'
import { mockAuthContextWithoutUser, mockAuthContextWithUser } from 'tests/AuthContextUtils'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('features/auth/context/AuthContext')

const expectedResponse = { status: AccountState.SUSPENDED }
const simulateSuspensionStatus200 = () => {
  mockServer.getApi<UserSuspensionStatusResponse>('/v1/account/suspension_status', expectedResponse)
}

const simulateSuspensionStatusError = () => {
  mockServer.getApi<UserSuspensionStatusResponse>('/v1/account/suspension_status', {
    responseOptions: { statusCode: 400 },
  })
}
jest.mock('libs/jwt/jwt')

mockAuthContextWithUser({
  ...beneficiaryUser,
})

describe('useAccountSuspensionStatus', () => {
  it('should return suspension status if it exists', async () => {
    simulateSuspensionStatus200()
    const { result } = renderSuspensionStatusHook()

    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(result.current.data?.status).toBe(expectedResponse.status)
  })

  it('should return undefined if error', async () => {
    simulateSuspensionStatusError()
    const { result } = renderSuspensionStatusHook()

    await waitFor(async () => expect(result.current.isError).toEqual(true))

    expect(result.current.data).toBeUndefined()
  })

  it('should only fetch data when user is logged in', async () => {
    mockAuthContextWithoutUser()
    simulateSuspensionStatus200()
    const { result } = renderSuspensionStatusHook()

    await waitFor(async () => expect(result.current.isFetched).toEqual(false))
    await waitFor(async () => expect(result.current.isEnabled).toEqual(false))
  })
})

const renderSuspensionStatusHook = () =>
  renderHook(() => useAccountSuspensionStatusQuery(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

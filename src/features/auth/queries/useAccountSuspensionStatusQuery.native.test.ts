import { AccountState, UserSuspensionStatusResponse } from 'api/gen'
import { useAccountSuspensionStatusQuery } from 'features/auth/queries/useAccountSuspensionStatusQuery'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')

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

describe('useAccountSuspensionStatus', () => {
  it('should return suspension status if it exists', async () => {
    simulateSuspensionStatus200()
    const { result } = renderSuspensionDateHook(true)

    await waitFor(async () => expect(result.current.isSuccess).toEqual(true))

    expect(result.current.data?.status).toBe(expectedResponse.status)
  })

  it('should return undefined if error', async () => {
    simulateSuspensionStatusError()
    const { result } = renderSuspensionDateHook(true)

    await waitFor(async () => expect(result.current.isSuccess).toEqual(false))

    expect(result.current.data).toBeUndefined()
  })
})

const renderSuspensionDateHook = (enabled: boolean) =>
  renderHook(() => useAccountSuspensionStatusQuery(enabled), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

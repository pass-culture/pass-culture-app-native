import { UserSuspensionDateResponse } from 'api/gen'
import { useAccountSuspensionDate } from 'features/auth/api/useAccountSuspensionDate'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('libs/jwt')

const expectedResponse = { date: '2022-05-11T10:29:25.332786Z' }
function simulateSuspensionDate200() {
  mockServer.getApi<UserSuspensionDateResponse>('/v1/account/suspension_date', expectedResponse)
}

function simulateSuspensionDateActiveAccount() {
  mockServer.getApi<UserSuspensionDateResponse>('/v1/account/suspension_date', {
    responseOptions: { statusCode: 403 },
  })
}

describe('useAccountSuspensionDate', () => {
  it('should return suspension date if it exists', async () => {
    simulateSuspensionDate200()
    const { result } = renderSuspensionDateHook()

    await act(async () => {})

    expect(result.current.data?.date).toBe(expectedResponse.date)
  })

  it('should return undefined for unsuspended user', async () => {
    simulateSuspensionDateActiveAccount()
    const { result, unmount } = renderSuspensionDateHook()

    expect(result.current.data).toBeUndefined()

    unmount()
  })
})

const renderSuspensionDateHook = () =>
  renderHook(() => useAccountSuspensionDate(), {
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

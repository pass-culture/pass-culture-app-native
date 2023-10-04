import { AccountState } from 'api/gen'
import { useAccountSuspensionStatus } from 'features/auth/api/useAccountSuspensionStatus'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

const expectedResponse = { status: AccountState.SUSPENDED }
function simulateSuspensionStatus200() {
  mockServer.getAPIV1('/native/v1/account/suspension_status', expectedResponse)
}

function simulateSuspensionStatusError() {
  mockServer.getAPIV1('/native/v1/account/suspension_status', {
    responseOptions: { statusCode: 400 },
  })
}

describe('useAccountSuspensionStatus', () => {
  it('should return suspension status if it exists', async () => {
    simulateSuspensionStatus200()
    const { result } = renderSuspensionDateHook()

    await act(async () => {})
    expect(result.current.data?.status).toBe(expectedResponse.status)
  })

  it('should return null if error', async () => {
    simulateSuspensionStatusError()
    const { result } = renderSuspensionDateHook()

    await act(async () => {})
    expect(result.current.data).toBeNull()
  })
})

const renderSuspensionDateHook = () =>
  renderHook(() => useAccountSuspensionStatus(), {
    /* eslint-disable local-rules/no-react-query-provider-hoc */
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

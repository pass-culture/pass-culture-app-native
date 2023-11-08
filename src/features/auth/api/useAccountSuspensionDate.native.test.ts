import { useAccountSuspensionDate } from 'features/auth/api/useAccountSuspensionDate'
import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { act, renderHook } from 'tests/utils'

const expectedResponse = { date: '2022-05-11T10:29:25.332786Z' }
function simulateSuspensionDate200() {
  mockServer.getApiV1('/account/suspension_date', expectedResponse)
}

function simulateSuspensionDateActiveAccount() {
  mockServer.getApiV1('/account/suspension_date', {
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
    /* eslint-disable local-rules/no-react-query-provider-hoc */
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

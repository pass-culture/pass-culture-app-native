import { rest } from 'msw'

import { AccountState } from 'api/gen'
import { useAccountSuspensionStatus } from 'features/auth/api/useAccountSuspensionStatus'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, waitFor } from 'tests/utils'

const expectedResponse = { status: AccountState.SUSPENDED }
function simulateSuspensionStatus200() {
  server.use(
    rest.get(env.API_BASE_URL + '/native/v1/account/suspension_status', async (_, res, ctx) =>
      res(ctx.status(200), ctx.json(expectedResponse))
    )
  )
}

function simulateSuspensionStatusError() {
  server.use(
    rest.get(env.API_BASE_URL + '/native/v1/account/suspension_status', async (_, res, ctx) =>
      res(ctx.status(400))
    )
  )
}

describe('useAccountSuspensionStatus', () => {
  it('should return suspension status if it exists', async () => {
    simulateSuspensionStatus200()
    const { result } = renderSuspensionDateHook()

    await waitFor(() => {
      expect(result.current.data?.status).toBe(expectedResponse.status)
    })
  })

  it('should return undefined if error', async () => {
    simulateSuspensionStatusError()
    const { result } = renderSuspensionDateHook()

    await waitFor(() => {
      expect(result.current.data).toBeUndefined()
    })
  })
})

const renderSuspensionDateHook = () =>
  renderHook(() => useAccountSuspensionStatus(), {
    /* eslint-disable local-rules/no-react-query-provider-hoc */
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

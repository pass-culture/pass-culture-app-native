import { rest } from 'msw'
import waitForExpect from 'wait-for-expect'

import { useAccountUnsuspend } from 'features/auth/suspendedAccount/SuspendedAccount/useAccountUnsuspend'
import { env } from 'libs/environment'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { server } from 'tests/server'
import { renderHook, superFlushWithAct } from 'tests/utils'

const onSuccess = jest.fn()
const onError = jest.fn()

// eslint-disable-next-line local-rules/no-allow-console
allowConsole({
  error: true,
})

function simulateUnsuspension() {
  server.use(
    rest.post(env.API_BASE_URL + '/native/v1/account/unsuspend', async (_, res, ctx) =>
      res(ctx.status(200))
    )
  )
}

function simulateUnsuspensionError() {
  server.use(
    rest.post(env.API_BASE_URL + '/native/v1/account/unsuspend', async (_, res, ctx) =>
      res(ctx.status(400))
    )
  )
}

describe('useAccountUnsuspend', () => {
  it('should call success function on success', async () => {
    simulateUnsuspension()
    const { result } = renderAccountUnsuspendHook()

    result.current.mutate()
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1)
      expect(onError).not.toHaveBeenCalled()
    })
  })

  it('should call error function on error', async () => {
    simulateUnsuspensionError()
    const { result } = renderAccountUnsuspendHook()

    result.current.mutate()
    await superFlushWithAct()

    await waitForExpect(() => {
      expect(onSuccess).not.toHaveBeenCalled()
      expect(onError).toHaveBeenCalledTimes(1)
    })
  })
})

const renderAccountUnsuspendHook = () =>
  renderHook(() => useAccountUnsuspend(onSuccess, onError), {
    /* eslint-disable local-rules/no-react-query-provider-hoc */
    wrapper: ({ children }) => reactQueryProviderHOC(children),
  })

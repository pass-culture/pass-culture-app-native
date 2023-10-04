import { mockServer } from 'tests/mswServer'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { renderHook, waitFor } from 'tests/utils'

import { useAccountUnsuspend } from './useAccountUnsuspend'

const onSuccess = jest.fn()
const onError = jest.fn()

function simulateUnsuspension() {
  mockServer.post('/native/v1/account/unsuspend', {})
}

function simulateUnsuspensionError() {
  mockServer.post('/native/v1/account/unsuspend', { responseOptions: { statusCode: 400 } })
}

describe('useAccountUnsuspend', () => {
  it('should call success function on success', async () => {
    simulateUnsuspension()
    const { result } = renderAccountUnsuspendHook()

    result.current.mutate()

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1)
      expect(onError).not.toHaveBeenCalled()
    })
  })

  it('should call error function on error', async () => {
    simulateUnsuspensionError()
    const { result } = renderAccountUnsuspendHook()

    result.current.mutate()

    await waitFor(() => {
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

import { createCore } from 'libs/poc-valtio/core'
import { act, renderHook } from 'tests/utils'

describe('core', () => {
  it('should be instantiated with no error', () => {
    const core = createCore()

    expect(core).toBeDefined()
  })

  it('should modify the store through an action call', () => {
    const core = createCore()

    expect(core.user.getState().isLoggedIn).toBeFalsy()

    core.user.login()

    expect(core.user.getState().isLoggedIn).toBeTruthy()
  })

  it('should render a hook', async () => {
    const core = createCore()

    renderHook(() => core.user.useMyHook())

    await act(async () => {})

    expect(core.user.getState().firstname).toBe('xavier')
  })

  it('should call another service action', () => {
    const core = createCore()
    core.user.callsCreditService()

    expect(core.credit.getState().currentCredit).toBe(1)
  })
})

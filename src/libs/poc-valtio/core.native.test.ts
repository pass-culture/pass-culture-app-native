import { createCore } from 'libs/poc-valtio/core'
import { act, renderHook } from 'tests/utils'

describe('core', () => {
  it('should be instantiated with no error', () => {
    const core = createCore()

    expect(core).toBeDefined()
  })

  it('should modify the store through an action call', () => {
    const core = createCore()

    expect(core.user.state.isLoggedIn).toBeFalsy()

    core.user.actions.login()

    expect(core.user.state.isLoggedIn).toBeTruthy()
  })

  it('should render a hook', async () => {
    const core = createCore()

    renderHook(() => core.user.actions.useMyHook())

    await act(async () => {})

    expect(core.user.state.firstname).toBe('xavier')
  })

  it('should call another service action', () => {
    const core = createCore()
    core.user.actions.callsCreditService()

    expect(core.credit.state.currentCredit).toBe(1)
  })
})
